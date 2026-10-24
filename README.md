# LocalPulse v2.0 (SoundPass) 🎟️⚡
> **High-Throughput Local Event Discovery, Reservation & Fast-Pass Platform**  
> *Engineered as an enterprise full-stack re-architecture of a legacy monolithic PHP university project.*

[![Django 5.0](https://img.shields.io/badge/Django-5.0+-092e20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16_Alpine-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose_Orchestrated-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📖 Executive Summary & Architectural Vision

**LocalPulse v2.0** is a production-grade Event Discovery & Ticketing platform designed for high-concurrency reservation bursts (flash-sales, popular community tech meetups, concert launches). Originally conceived as a monolithic university submission (`project_zaliczenie`) written in procedural PHP on XAMPP, this repository demonstrates a **full enterprise re-engineering** into a decoupled, containerized, and concurrency-safe distributed web application.

---

## 🏛️ Project Evolution: Legacy PHP to Modern Enterprise Stack

```
LEGACY SYSTEM (University Monolith)           MODERN ARCHITECTURE (LocalPulse v2.0)
┌─────────────────────────────────┐            ┌──────────────────────────────────────────┐
│   XAMPP Monolith (Apache/PHP)   │            │   Next.js 14 App Router (React Server)  │
│   - Procedural spaghetti code   │            │   - TypeScript strict typing             │
│   - Inline HTML string echoes   │            │   - Tailwind CSS Glassmorphic Dark UI    │
│   - Stateful $_SESSION in files │            │   - Client-side token hydration          │
└──────────────┬──────────────────┘            └────────────────────┬─────────────────────┘
               │                                                    │ Stateless Bearer JWT
               ▼                                                    ▼
┌─────────────────────────────────┐            ┌──────────────────────────────────────────┐
│   Unsafe Database Layer         │            │   Django 5 REST Framework Engine         │
│   - Raw SQL string injection    │            │   - transaction.atomic()                 │
│   - Plaintext passwords         │            │   - select_for_update() row lock         │
│   - Separate 'users' & 'events' │            │   - select_related() N+1 query killer    │
│   - Zero transactions or locks  │            │   - drf-spectacular OpenAPI 3 specs      │
└──────────────┬──────────────────┘            └────────────────────┬─────────────────────┘
               │                                                    │ ACID Transactions
               ▼                                                    ▼
┌─────────────────────────────────┐            ┌──────────────────────────────────────────┐
│   MySQL on localhost            │            │   PostgreSQL 16 Container                │
│   - No foreign key integrity    │            │   - Relational Foreign Key constraints   │
│   - Vulnerable to overbooking   │            │   - UniqueConstraint(user, event)        │
└─────────────────────────────────┘            └──────────────────────────────────────────┘
```

### Forensic Audit of the Legacy Codebase

| Component | Legacy University State (`legacy/`) | Enterprise Modernization in v2.0 |
| :--- | :--- | :--- |
| **Architecture** | Coupled PHP scripts (`dashboard.php`, `core.php`) mixing database queries with HTML string interpolation. | **Headless Decoupled Microservice:** Django 5 REST backend providing strict OpenAPI 3 JSON contracts + Next.js 14 App Router frontend. |
| **Authentication** | Stateful `$_SESSION` written to local filesystem; plaintext password check (`$password === $user['pass']`). | **Stateless JWT Rotation (`SimpleJWT`):** 15-minute access tokens + sliding refresh tokens with blacklisting; passwords salted and hashed via PBKDF2-SHA256. |
| **Data Integrity** | Two disjoint databases (`users` and `events`) without foreign key relations; raw SQL queries (`register.php`, `my_events.php`). | **Normalized PostgreSQL 16 Schema:** Relational foreign keys between `Category`, `Venue`, `Event`, and `Registration`. |
| **Concurrency & RSVP** | No concept of capacity limits; simultaneous signups cause arbitrary data overwrites and race conditions. | **Pessimistic Row-Level Locking:** `select_for_update()` inside `transaction.atomic()` guarantees zero overbooking even when 1,000 users request the final ticket concurrently. |
| **Query Performance** | Unbounded `SELECT *` waterfalls resulting in classic N+1 query storms. | **Optimized ORM Joins:** `select_related('venue', 'category', 'organizer')` and `prefetch_related()` collapses query count to $O(1)$. |
| **File Handling** | `move_uploaded_file()` without MIME, extension, or magic byte validation, exposing server to Remote Code Execution (RCE). | **Secure Media Pipelines:** Storage abstraction with validated URLs and remote asset isolation. |
| **Infrastructure** | Manual XAMPP control panel setup dependent on Windows paths. | **Docker & Docker Compose:** Multi-stage builds, Alpine base images, PostgreSQL healthchecks (`pg_isready`), automated migrations. |

---

## 🔒 Concurrency Deep Dive: How `select_for_update()` Prevents Overbooking

In event ticketing and flash-sales, the **Lost Update** race condition occurs when two concurrent requests read `remaining_spots = 1` simultaneously, both validate `remaining_spots > 0`, and both decrement to `0`, resulting in **2 sold tickets for 1 available spot**.

LocalPulse v2.0 solves this at the database engine level:

```python
# backend/events/views.py
with transaction.atomic():
    # 1. Acquire an exclusive row-level lock in PostgreSQL
    # All other concurrent transactions attempting to read this event FOR UPDATE will block
    event = Event.objects.select_for_update().get(pk=pk)

    # 2. Check current capacity under lock guarantee
    if event.remaining_spots <= 0:
        return Response({"detail": "Event sold out!"}, status=400)

    # 3. Atomically decrement inventory
    event.remaining_spots -= 1
    event.save(update_fields=['remaining_spots'])

    # 4. Create cryptographically verifiable pass with UniqueConstraint
    registration = Registration.objects.create(
        user=request.user,
        event=event,
        status=Registration.Status.CONFIRMED
    )
```

Furthermore, database-level protection is enforced via Django constraints:
```python
class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=['user', 'event'],
            name='unique_user_event_registration'
        )
    ]
```

---

## 🚀 Quick Start (One-Command Docker Setup)

The entire platform (PostgreSQL 16, Django REST backend, and Next.js 14 frontend) is fully containerized.

### Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- Git

### 1. Clone & Launch
```bash
# Clone the repository
git clone https://github.com/ddd2221/local-events-manager.git
cd local-events-manager

# Launch the orchestrated stack
docker-compose up --build
```

### 2. Access Services
- **Web Application (Frontend):** [http://localhost:3000](http://localhost:3000)
- **REST API Root (Backend):** [http://localhost:8000/api/](http://localhost:8000/api/)
- **Interactive Swagger UI (OpenAPI 3):** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **ReDoc Documentation:** [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- **Django Admin Portal:** [http://localhost:8000/admin/](http://localhost:8000/admin/)

### 3. Pre-Seeded Accounts
The automated entrypoint runs `python manage.py seed_events`, creating realistic Polish venues, categories, and 12+ events with these ready-to-test credentials:

| Role | Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Superuser / Admin** | `admin` | `admin123` | Full Django Admin & Event Management |
| **Demo Attendee** | `demo` | `demo123` | Ticket booking, RSVP fast-pass claims |

*(Clickable one-click credential buttons are also available directly on the web login screen).*

---

## 🧪 Automated Testing & Verification

The test suite validates row-level locking, capacity limits, duplicate registration rejections, and dynamic filters:

```bash
# Run tests inside Docker container
docker-compose exec localpulse_backend pytest

# Or run locally via Django test runner
cd backend
python manage.py test events.tests
```

### Test Coverage Highlights:
- `test_successful_reservation_atomic_decrement`: Verifies spot decrement and UUID4 pass generation.
- `test_overbooking_prevented_when_spots_exhausted`: Proves the last-spot race condition rejection.
- `test_duplicate_registration_by_same_user_prevented`: Asserts database uniqueness constraint.
- `test_cancellation_restores_spot`: Ensures spot return rollback inside atomic transaction.
- `test_api_filtering_by_city_and_category`: Asserts declarative `django-filter` correctness.

---

## 📁 Repository Structure

```
├── .gitattributes             # Enforces LF endings for Docker scripts on Windows
├── docker-compose.yml         # Multi-container orchestration (DB, API, Web)
├── README.md                  # System documentation & migration case study
├── legacy/                    # Archived legacy university PHP monolith (XAMPP)
│   ├── add_event.php
│   ├── dashboard.php
│   ├── db.php
│   ├── login.php
│   └── register.php
├── backend/                   # Django 5 REST Framework Service
│   ├── Dockerfile
│   ├── entrypoint.sh          # Auto-migration & seed script
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/                # Settings, WSGI/ASGI, URLs, Swagger
│   ├── users/                 # JWT Authentication & User Profiles
│   └── events/                # Categories, Venues, Events, Concurrency Engine
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── filters.py
│       └── tests/
└── frontend/                  # Next.js 14 App Router Application
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.ts     # Dark-mode design system tokens
    ├── app/
    │   ├── layout.tsx         # Root layout with responsive Navbar
    │   ├── page.tsx           # Event Catalog & Real-Time Search
    │   ├── my-events/         # Digital Passes & Cancellation Wallet
    │   ├── create-event/      # Host Event Organizer Dashboard
    │   ├── login/             # JWT Sign In with 1-click Demo Fill
    │   └── register/          # New User Onboarding
    ├── components/
    │   ├── EventCard.tsx
    │   ├── FilterBar.tsx
    │   ├── RsvpModal.tsx      # Concurrency-safe RSVP modal
    │   ├── TicketPassCard.tsx # Digital Pass with QR & UUID stub
    │   └── CapacityBar.tsx
    └── lib/
        ├── api.ts             # Typed API client with JWT interceptor
        └── types.ts           # TypeScript domain definitions
```

---

## 📜 License & Academic Integrity
Refactored from an original academic project for the **"Internet Engineering"** course. LocalPulse v2.0 demonstrates commercial software house standards, architectural patterns, and production engineering practices.
