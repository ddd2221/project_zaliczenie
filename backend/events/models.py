import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon_name = models.CharField(max_length=50, default='calendar', help_text='Lucide icon name')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Venue(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100, db_index=True)
    address = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField(default=100)

    class Meta:
        ordering = ['city', 'name']
        unique_together = ('name', 'city')

    def __str__(self):
        return f"{self.name} ({self.city})"


class Event(models.Model):
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='organized_events'
    )
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='events'
    )
    venue = models.ForeignKey(
        Venue,
        on_delete=models.PROTECT,
        related_name='events'
    )
    start_time = models.DateTimeField(db_index=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_capacity = models.PositiveIntegerField()
    remaining_spots = models.PositiveIntegerField()
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        help_text='0 for free community events, >0 for paid tickets'
    )
    is_published = models.BooleanField(default=True, db_index=True)
    image_url = models.URLField(
        max_length=500,
        blank=True,
        default='https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['start_time', 'is_published']),
            models.Index(fields=['category', 'venue']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        if self.remaining_spots is None:
            self.remaining_spots = self.total_capacity
        super().save(*args, **kwargs)

    @property
    def is_sold_out(self):
        return self.remaining_spots <= 0

    @property
    def reserved_percentage(self):
        if self.total_capacity == 0:
            return 100
        booked = self.total_capacity - self.remaining_spots
        return min(100, int((booked / self.total_capacity) * 100))

    def __str__(self):
        return f"{self.title} @ {self.venue.name} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"


class Registration(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    ticket_code = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        db_index=True,
        help_text='Cryptographically unique UUID4 pass for entry verification'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CONFIRMED,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'event'],
                name='unique_user_event_registration',
                violation_error_message='You already have an active registration for this event.'
            )
        ]

    def __str__(self):
        return f"Pass {self.ticket_code} - {self.user.username} for {self.event.title} [{self.status}]"
