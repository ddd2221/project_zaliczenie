"""
Idempotent seed command for LocalPulse v2.0.
Seeds default admin/demo users, Polish venues, categories, and 12+ real-world events.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from events.models import Category, Venue, Event

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds database idempotently with initial users, Polish venues, categories, and events"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("==> Seeding LocalPulse database..."))

        # 1. Create Core Users
        admin_user, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@localpulse.io",
                "is_staff": True,
                "is_superuser": True,
            }
        )
        if created:
            admin_user.set_password("admin123")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("  [+] Created superuser: admin / admin123"))
        else:
            self.stdout.write("  [*] Superuser 'admin' already exists")

        demo_user, created = User.objects.get_or_create(
            username="demo",
            defaults={
                "email": "demo@localpulse.io",
                "is_staff": False,
            }
        )
        if created:
            demo_user.set_password("demo123")
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("  [+] Created demo user: demo / demo123"))
        else:
            self.stdout.write("  [*] Demo user 'demo' already exists")

        # 2. Categories
        categories_data = [
            {"name": "Tech & AI", "icon_name": "Cpu"},
            {"name": "Concert", "icon_name": "Music"},
            {"name": "Festival", "icon_name": "Sparkles"},
            {"name": "Workshop", "icon_name": "Wrench"},
            {"name": "Stand-up", "icon_name": "Mic"},
            {"name": "Exhibition", "icon_name": "Palette"},
            {"name": "Sports", "icon_name": "Trophy"},
            {"name": "Networking", "icon_name": "Users"},
        ]

        categories = {}
        for cat in categories_data:
            obj, _ = Category.objects.get_or_create(
                name=cat["name"],
                defaults={"icon_name": cat["icon_name"]}
            )
            categories[cat["name"]] = obj
        self.stdout.write(self.style.SUCCESS(f"  [+] Categories verified ({len(categories)} items)"))

        # 3. Polish Venues
        venues_data = [
            {"name": "Hala Stulecia", "city": "Wrocław", "address": "Wystawowa 1", "capacity": 5000},
            {"name": "Narodowe Forum Muzyki", "city": "Wrocław", "address": "Plac Wolności 1", "capacity": 1800},
            {"name": "Impart Centrum", "city": "Wrocław", "address": "Mazowiecka 17", "capacity": 600},
            {"name": "Stary Klasztor (Sala Gotycka)", "city": "Wrocław", "address": "Purkyniego 1", "capacity": 450},
            {"name": "Browar Mieszczański", "city": "Wrocław", "address": "Hubska 44", "capacity": 350},
            {"name": "Concordia Design Wrocław", "city": "Wrocław", "address": "Wyspa Słodowa 7", "capacity": 250},
            {"name": "Progresja Music Zone", "city": "Warszawa", "address": "Fort Wola 22", "capacity": 2200},
            {"name": "Tauron Arena Kraków", "city": "Kraków", "address": "Stanisława Lema 7", "capacity": 15000},
            {"name": "CK Zamek", "city": "Poznań", "address": "Święty Marcin 80/82", "capacity": 800},
        ]

        venues = {}
        for v in venues_data:
            obj, _ = Venue.objects.get_or_create(
                name=v["name"],
                city=v["city"],
                defaults={"address": v["address"], "capacity": v["capacity"]}
            )
            venues[f"{v['name']}_{v['city']}"] = obj
        self.stdout.write(self.style.SUCCESS(f"  [+] Venues verified ({len(venues)} items)"))

        # 4. Realistic Local Community & Tech Events
        now = timezone.now()
        events_data = [
            {
                "title": "Wrocław AI Summit 2026: LLMs & Autonomous Agents",
                "category": categories["Tech & AI"],
                "venue": venues["Concordia Design Wrocław_Wrocław"],
                "start_delta_days": 4,
                "start_hour": 10,
                "duration_hours": 8,
                "total_capacity": 150,
                "remaining_spots": 24,
                "price": 0.00,
                "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
                "description": "The premier gathering for AI engineers, data scientists, and startup founders in Lower Silesia. Keynotes on fine-tuning enterprise LLMs, multi-agent evaluation frameworks, and high-concurrency inference pipelines."
            },
            {
                "title": "Symphonic Rock Odyssey: Wroclaw Philharmonic Live",
                "category": categories["Concert"],
                "venue": venues["Narodowe Forum Muzyki_Wrocław"],
                "start_delta_days": 7,
                "start_hour": 19,
                "duration_hours": 3,
                "total_capacity": 500,
                "remaining_spots": 38,
                "price": 149.00,
                "image_url": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
                "description": "Experience iconic rock anthems from Queen, Pink Floyd, and Deep Purple re-imagined for an 80-piece philharmonic orchestra inside the acoustically acclaimed NFM Main Hall."
            },
            {
                "title": "Craft Beer & Street Food Fiesta 2026",
                "category": categories["Festival"],
                "venue": venues["Browar Mieszczański_Wrocław"],
                "start_delta_days": 10,
                "start_hour": 14,
                "duration_hours": 9,
                "total_capacity": 300,
                "remaining_spots": 112,
                "price": 0.00,
                "image_url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
                "description": "Over 25 independent Lower Silesian microbreweries, artisanal food trucks, live acoustic sessions, and homebrewing masterclasses in the historic post-industrial venue."
            },
            {
                "title": "Full-Stack Rust & WebAssembly Masterclass",
                "category": categories["Workshop"],
                "venue": venues["Concordia Design Wrocław_Wrocław"],
                "start_delta_days": 12,
                "start_hour": 11,
                "duration_hours": 5,
                "total_capacity": 40,
                "remaining_spots": 6,
                "price": 89.00,
                "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
                "description": "Deep-dive into building high-throughput services with Rust Actix-web, compiling modules to WebAssembly, and integrating low-latency cryptographic verification."
            },
            {
                "title": "Midnight Jazz & Soul Jam: Wrocław All-Stars",
                "category": categories["Concert"],
                "venue": venues["Stary Klasztor (Sala Gotycka)_Wrocław"],
                "start_delta_days": 14,
                "start_hour": 21,
                "duration_hours": 4,
                "total_capacity": 200,
                "remaining_spots": 12,
                "price": 45.00,
                "image_url": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
                "description": "Intimate candle-lit jam session featuring leading Polish and international jazz virtuosos in the historic Gothic Hall. Improvisations, wine, and warm atmospheric vibes."
            },
            {
                "title": "Wrocław Stand-up Comedy Showcase (English Friendly)",
                "category": categories["Stand-up"],
                "venue": venues["Impart Centrum_Wrocław"],
                "start_delta_days": 16,
                "start_hour": 19,
                "duration_hours": 2,
                "total_capacity": 250,
                "remaining_spots": 55,
                "price": 50.00,
                "image_url": "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80",
                "description": "An electrifying evening of sharp, observational humor from European comedic circuit regulars. Fast-paced sets covering expat life, culture shocks, and modern tech absurdities."
            },
            {
                "title": "Modernist Architecture & Digital Art Exhibition",
                "category": categories["Exhibition"],
                "venue": venues["Hala Stulecia_Wrocław"],
                "start_delta_days": 18,
                "start_hour": 10,
                "duration_hours": 8,
                "total_capacity": 600,
                "remaining_spots": 280,
                "price": 25.00,
                "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
                "description": "Interactive projection mapping, VR installations, and historical blueprints celebrating Max Berg's architectural legacy and modern geometric design."
            },
            {
                "title": "Wrocław Tech Run 10K & Half Marathon",
                "category": categories["Sports"],
                "venue": venues["Hala Stulecia_Wrocław"],
                "start_delta_days": 21,
                "start_hour": 8,
                "duration_hours": 4,
                "total_capacity": 1000,
                "remaining_spots": 140,
                "price": 60.00,
                "image_url": "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
                "description": "Join thousands of runners along the scenic Odra River boulevard. Chip timing, custom medals, tech networking village at the finish line."
            },
            {
                "title": "Warsaw Electronic Music Biennale",
                "category": categories["Festival"],
                "venue": venues["Progresja Music Zone_Warszawa"],
                "start_delta_days": 24,
                "start_hour": 22,
                "duration_hours": 8,
                "total_capacity": 1200,
                "remaining_spots": 95,
                "price": 120.00,
                "image_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
                "description": "Cutting-edge modular synthesis, live visual artists, and internationally celebrated dark-techno producers across two stages."
            },
            {
                "title": "Kraków Cloud Native & DevOps Con",
                "category": categories["Tech & AI"],
                "venue": venues["Tauron Arena Kraków_Kraków"],
                "start_delta_days": 28,
                "start_hour": 9,
                "duration_hours": 9,
                "total_capacity": 800,
                "remaining_spots": 185,
                "price": 199.00,
                "image_url": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
                "description": "Hands-on workshops on Kubernetes operator lifecycle, eBPF observability, zero-trust service meshes, and GitOps multi-cluster deployments."
            },
            {
                "title": "Poznań Open-Air Indie Film & Drone Light Night",
                "category": categories["Exhibition"],
                "venue": venues["CK Zamek_Poznań"],
                "start_delta_days": 30,
                "start_hour": 20,
                "duration_hours": 4,
                "total_capacity": 300,
                "remaining_spots": 0,  # Sold out test event!
                "price": 0.00,
                "image_url": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
                "description": "SOLD OUT SPECIAL: Short films from Central European cinema academies followed by a synchronized 200-drone constellation display above the castle courtyard."
            },
            {
                "title": "Founders & Investors Networking Breakfast",
                "category": categories["Networking"],
                "venue": venues["Concordia Design Wrocław_Wrocław"],
                "start_delta_days": 5,
                "start_hour": 9,
                "duration_hours": 2,
                "total_capacity": 50,
                "remaining_spots": 4,  # High urgency test event!
                "price": 0.00,
                "image_url": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
                "description": "Curated pitch rounds, specialty pour-over coffee, and direct introductions between early-stage B2B software founders and regional angel syndicates."
            }
        ]

        created_count = 0
        for ev in events_data:
            start_dt = (now + timedelta(days=ev["start_delta_days"])).replace(
                hour=ev["start_hour"], minute=0, second=0, microsecond=0
            )
            end_dt = start_dt + timedelta(hours=ev["duration_hours"])

            event_obj, created = Event.objects.get_or_create(
                title=ev["title"],
                defaults={
                    "organizer": admin_user,
                    "category": ev["category"],
                    "venue": ev["venue"],
                    "start_time": start_dt,
                    "end_time": end_dt,
                    "total_capacity": ev["total_capacity"],
                    "remaining_spots": ev["remaining_spots"],
                    "price": ev["price"],
                    "image_url": ev["image_url"],
                    "description": ev["description"],
                    "is_published": True,
                }
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f"  [+] Events seed complete ({created_count} newly created, {len(events_data)} verified)")
        )
