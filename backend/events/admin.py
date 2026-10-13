from django.contrib import admin
from .models import Category, Venue, Event, Registration

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon_name')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'address', 'capacity')
    list_filter = ('city',)
    search_fields = ('name', 'city', 'address')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'venue',
        'start_time',
        'remaining_spots',
        'total_capacity',
        'price',
        'is_published',
    )
    list_filter = ('category', 'venue__city', 'is_published', 'start_time')
    search_fields = ('title', 'description', 'venue__name', 'venue__city')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_time'

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('ticket_code', 'user', 'event', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'event__category')
    search_fields = ('ticket_code', 'user__username', 'event__title')
    readonly_fields = ('ticket_code', 'created_at')
