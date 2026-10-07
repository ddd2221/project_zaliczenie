from django.contrib import admin
from .models import Category, Venue, Event

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
