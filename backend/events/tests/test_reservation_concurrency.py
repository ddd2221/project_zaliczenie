from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status
from events.models import Category, Venue, Event, Registration

User = get_user_model()


class EventReservationConcurrencyTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = User.objects.create_user(
            username="organizer", email="org@localpulse.io", password="pass123Password!"
        )
        self.user1 = User.objects.create_user(
            username="testuser1", email="user1@localpulse.io", password="pass123Password!"
        )
        self.user2 = User.objects.create_user(
            username="testuser2", email="user2@localpulse.io", password="pass123Password!"
        )

        self.category = Category.objects.create(name="Tech & AI", slug="tech-ai", icon_name="Cpu")
        self.venue = Venue.objects.create(
            name="Concordia Design", city="Wrocław", address="Wyspa Słodowa 7", capacity=100
        )

        # Event with strictly 1 spot available for testing the last-spot race condition
        self.event_single_spot = Event.objects.create(
            organizer=self.organizer,
            title="Exclusive High-Concurrency Workshop",
            category=self.category,
            venue=self.venue,
            start_time=timezone.now() + timedelta(days=2),
            end_time=timezone.now() + timedelta(days=2, hours=3),
            total_capacity=1,
            remaining_spots=1,
            price=0.00,
            is_published=True,
        )

    def test_successful_reservation_atomic_decrement(self):
        """Verify that booking a spot decrements remaining_spots and generates a valid UUID4 pass."""
        self.client.force_authenticate(user=self.user1)
        url = f"/api/events/{self.event_single_spot.pk}/register/"
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["remaining_spots"], 0)

        self.event_single_spot.refresh_from_db()
        self.assertEqual(self.event_single_spot.remaining_spots, 0)

        registration = Registration.objects.get(user=self.user1, event=self.event_single_spot)
        self.assertEqual(registration.status, Registration.Status.CONFIRMED)
        self.assertIsNotNone(registration.ticket_code)

    def test_overbooking_prevented_when_spots_exhausted(self):
        """Verify that when 0 spots remain, subsequent reservations are rejected with 400 Bad Request."""
        # First user grabs the last spot
        self.client.force_authenticate(user=self.user1)
        res1 = self.client.post(f"/api/events/{self.event_single_spot.pk}/register/")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        # Second user attempts to book the same event
        self.client.force_authenticate(user=self.user2)
        res2 = self.client.post(f"/api/events/{self.event_single_spot.pk}/register/")
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("sold out", res2.data["detail"].lower())

        self.event_single_spot.refresh_from_db()
        self.assertEqual(self.event_single_spot.remaining_spots, 0)
        # Verify only 1 registration exists in the database
        self.assertEqual(Registration.objects.filter(event=self.event_single_spot).count(), 1)

    def test_duplicate_registration_by_same_user_prevented(self):
        """Verify database and endpoint uniqueness constraint prevents duplicate tickets for same user."""
        self.client.force_authenticate(user=self.user1)
        # Expand capacity so spots aren't the issue
        self.event_single_spot.total_capacity = 10
        self.event_single_spot.remaining_spots = 10
        self.event_single_spot.save()

        # First signup
        res1 = self.client.post(f"/api/events/{self.event_single_spot.pk}/register/")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        # Immediate second signup
        res2 = self.client.post(f"/api/events/{self.event_single_spot.pk}/register/")
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already hold a confirmed reservation", res2.data["detail"])

    def test_cancellation_restores_spot(self):
        """Verify that cancelling an active reservation restores remaining_spots atomically."""
        self.client.force_authenticate(user=self.user1)
        self.client.post(f"/api/events/{self.event_single_spot.pk}/register/")

        self.event_single_spot.refresh_from_db()
        self.assertEqual(self.event_single_spot.remaining_spots, 0)

        registration = Registration.objects.get(user=self.user1, event=self.event_single_spot)
        cancel_url = f"/api/registrations/{registration.pk}/cancel/"
        cancel_res = self.client.post(cancel_url)

        self.assertEqual(cancel_res.status_code, status.HTTP_200_OK)
        self.event_single_spot.refresh_from_db()
        self.assertEqual(self.event_single_spot.remaining_spots, 1)

        registration.refresh_from_db()
        self.assertEqual(registration.status, Registration.Status.CANCELLED)

    def test_api_filtering_by_city_and_category(self):
        """Verify declarative filters return accurately matched event subsets."""
        # Kraków venue & event
        krk_venue = Venue.objects.create(name="Tauron", city="Kraków", address="Lema 7", capacity=5000)
        Event.objects.create(
            organizer=self.organizer,
            title="Kraków Concert",
            category=Category.objects.create(name="Music", slug="music"),
            venue=krk_venue,
            start_time=timezone.now() + timedelta(days=5),
            total_capacity=100,
            remaining_spots=50,
            price=20.00,
            is_published=True,
        )

        # Filter by Wrocław
        res_wroc = self.client.get("/api/events/?city=Wrocław")
        self.assertEqual(res_wroc.status_code, status.HTTP_200_OK)
        for item in res_wroc.data["results"]:
            self.assertEqual(item["venue"]["city"], "Wrocław")

        # Filter by Kraków
        res_krk = self.client.get("/api/events/?city=Kraków")
        self.assertEqual(res_krk.status_code, status.HTTP_200_OK)
        for item in res_krk.data["results"]:
            self.assertEqual(item["venue"]["city"], "Kraków")
