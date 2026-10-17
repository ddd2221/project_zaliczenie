import django_filters
from django.db.models import Q
from .models import Event


class EventFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(
        field_name='venue__city',
        lookup_expr='iexact',
        help_text='Filter by city name (e.g. Wrocław, Warszawa, Kraków)'
    )
    category = django_filters.CharFilter(
        field_name='category__slug',
        lookup_expr='exact',
        help_text='Filter by category slug (e.g. tech-ai, concert, festival)'
    )
    date_from = django_filters.IsoDateTimeFilter(
        field_name='start_time',
        lookup_expr='gte',
        help_text='Filter events occurring on or after ISO timestamp'
    )
    date_to = django_filters.IsoDateTimeFilter(
        field_name='start_time',
        lookup_expr='lte',
        help_text='Filter events occurring on or before ISO timestamp'
    )
    available_only = django_filters.BooleanFilter(
        method='filter_available_only',
        help_text='Show only events with remaining_spots > 0'
    )
    is_free = django_filters.BooleanFilter(
        method='filter_is_free',
        help_text='Show only free community events (price == 0)'
    )

    class Meta:
        model = Event
        fields = ['city', 'category', 'date_from', 'date_to', 'available_only', 'is_free']

    def filter_available_only(self, queryset, name, value):
        if value:
            return queryset.filter(remaining_spots__gt=0)
        return queryset

    def filter_is_free(self, queryset, name, value):
        if value:
            return queryset.filter(price=0.00)
        return queryset
