from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import Category, Venue, Event, Registration
from .serializers import (
    CategorySerializer,
    VenueSerializer,
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    RegistrationSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None


class VenueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_published=True)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        return EventDetailSerializer

    @extend_schema(
        summary="Reserve a spot (High-Concurrency Safe)",
        description=(
            "Locks event row via select_for_update inside an atomic transaction "
            "to prevent race conditions and overbooking. Decrements remaining_spots atomically."
        ),
        responses={
            201: OpenApiResponse(description="RSVP successfully confirmed with unique UUID pass"),
            400: OpenApiResponse(description="Sold out or user already registered"),
            401: OpenApiResponse(description="Authentication credentials were not provided"),
            404: OpenApiResponse(description="Event not found"),
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request, pk=None):
        """
        Concurrency-safe ticket/RSVP reservation handler.
        Uses PostgreSQL row-level pessimistic locking (SELECT ... FOR UPDATE).
        """
        with transaction.atomic():
            try:
                event = Event.objects.select_for_update().get(pk=pk)
            except Event.DoesNotExist:
                return Response(
                    {"detail": "Event not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if active reservation already exists
            existing_reg = Registration.objects.filter(
                user=request.user,
                event=event,
                status=Registration.Status.CONFIRMED
            ).first()

            if existing_reg:
                return Response(
                    {
                        "detail": "You already hold a confirmed reservation for this event.",
                        "ticket_code": existing_reg.ticket_code,
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check capacity limit
            if event.remaining_spots <= 0:
                return Response(
                    {"detail": "Sorry, this event is completely sold out!"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Atomically decrement remaining spots
            event.remaining_spots -= 1
            event.save(update_fields=['remaining_spots'])

            # Reactivate or create registration
            registration = Registration.objects.filter(user=request.user, event=event).first()
            if registration:
                registration.status = Registration.Status.CONFIRMED
                registration.cancelled_at = None
                registration.save(update_fields=['status', 'cancelled_at'])
            else:
                registration = Registration.objects.create(
                    user=request.user,
                    event=event,
                    status=Registration.Status.CONFIRMED
                )

            serializer = RegistrationSerializer(registration, context={'request': request})
            return Response(
                {
                    "message": "Your RSVP has been confirmed!",
                    "remaining_spots": event.remaining_spots,
                    "registration": serializer.data,
                },
                status=status.HTTP_201_CREATED
            )


class RegistrationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user)

    @extend_schema(
        summary="Cancel a Reservation",
        description="Cancels an active pass and atomically restores the spot to the event's remaining capacity.",
        responses={
            200: OpenApiResponse(description="Reservation successfully cancelled"),
            400: OpenApiResponse(description="Reservation was already cancelled"),
            404: OpenApiResponse(description="Reservation not found"),
        }
    )
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        with transaction.atomic():
            try:
                registration = Registration.objects.select_for_update().get(
                    pk=pk,
                    user=request.user
                )
            except Registration.DoesNotExist:
                return Response(
                    {"detail": "Registration not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            if registration.status == Registration.Status.CANCELLED:
                return Response(
                    {"detail": "This reservation is already cancelled."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            registration.status = Registration.Status.CANCELLED
            registration.cancelled_at = timezone.now()
            registration.save(update_fields=['status', 'cancelled_at'])

            # Return spot back to the event
            event = Event.objects.select_for_update().get(pk=registration.event_id)
            event.remaining_spots = min(event.total_capacity, event.remaining_spots + 1)
            event.save(update_fields=['remaining_spots'])

            return Response(
                {
                    "message": "Reservation successfully cancelled.",
                    "remaining_spots": event.remaining_spots,
                },
                status=status.HTTP_200_OK
            )
