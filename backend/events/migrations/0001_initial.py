from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(blank=True, max_length=120, unique=True)),
                ('icon_name', models.CharField(default='calendar', help_text='Lucide icon name', max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Categories',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Venue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('city', models.CharField(db_index=True, max_length=100)),
                ('address', models.CharField(max_length=255)),
                ('capacity', models.PositiveIntegerField(default=100)),
            ],
            options={
                'ordering': ['city', 'name'],
                'unique_together': {('name', 'city')},
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=255)),
                ('slug', models.SlugField(blank=True, max_length=280, unique=True)),
                ('description', models.TextField()),
                ('start_time', models.DateTimeField(db_index=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('total_capacity', models.PositiveIntegerField()),
                ('remaining_spots', models.PositiveIntegerField()),
                ('price', models.DecimalField(decimal_places=2, default=0.0, help_text='0 for free community events, >0 for paid tickets', max_digits=8)),
                ('is_published', models.BooleanField(db_index=True, default=True)),
                ('image_url', models.URLField(blank=True, default='https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='events', to='events.category')),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organized_events', to=settings.AUTH_USER_MODEL)),
                ('venue', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='events', to='events.venue')),
            ],
            options={
                'ordering': ['start_time'],
                'indexes': [
                    models.Index(fields=['start_time', 'is_published'], name='events_even_start_t_e0a359_idx'),
                    models.Index(fields=['category', 'venue'], name='events_even_categor_cf2168_idx'),
                ],
            },
        ),
    ]
