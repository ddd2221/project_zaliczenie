from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Venue, Event, Registration

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    events_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon_name', 'events_count')


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ('id', 'name', 'city', 'address', 'capacity')


class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class EventListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    venue = VenueSerializer(read_only=True)
    is_sold_out = serializers.BooleanField(read_only=True)
    reserved_percentage = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'title',
            'slug',
            'category',
            'venue',
            'start_time',
            'end_time',
            'total_capacity',
            'remaining_spots',
            'price',
            'is_sold_out',
            'reserved_percentage',
            'image_url',
            'created_at',
        )


class EventDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    venue = VenueSerializer(read_only=True)
    organizer = OrganizerSerializer(read_only=True)
    is_sold_out = serializers.BooleanField(read_only=True)
    reserved_percentage = serializers.IntegerField(read_only=True)
    user_registered = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            'id',
            'title',
            'slug',
            'description',
            'category',
            'venue',
            'organizer',
            'start_time',
            'end_time',
            'total_capacity',
            'remaining_spots',
            'price',
            'is_sold_out',
            'reserved_percentage',
            'image_url',
            'user_registered',
            'created_at',
            'updated_at',
        )

    def get_user_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Registration.objects.filter(
                event=obj,
                user=request.user,
                status=Registration.Status.CONFIRMED
            ).exists()
        return False


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=Venue.objects.all(),
        source='venue',
        write_only=True
    )

    class Meta:
        model = Event
        fields = (
            'id',
            'title',
            'description',
            'category_id',
            'venue_id',
            'start_time',
            'end_time',
            'total_capacity',
            'price',
            'image_url',
        )

    def validate(self, attrs):
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        if end_time and start_time and end_time <= start_time:
            raise serializers.ValidationError({"end_time": "End time must be strictly after start time."})

        venue = attrs.get('venue')
        total_capacity = attrs.get('total_capacity', 0)
        if venue and total_capacity > venue.capacity:
            raise serializers.ValidationError({
                "total_capacity": f"Capacity ({total_capacity}) exceeds venue maximum capacity ({venue.capacity})."
            })
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['organizer'] = user
        validated_data['remaining_spots'] = validated_data['total_capacity']
        return super().create(validated_data)


class RegistrationSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)
    ticket_code = serializers.UUIDField(read_only=True)

    class Meta:
        model = Registration
        fields = (
            'id',
            'ticket_code',
            'event',
            'status',
            'created_at',
            'cancelled_at',
        )
        read_only_fields = ('id', 'ticket_code', 'status', 'created_at', 'cancelled_at')
