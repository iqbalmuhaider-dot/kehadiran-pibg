# Kehadiran PIBG - SK Masjid Tanah

Borang pengesahan kehadiran untuk Mesyuarat Agung PIBG & Sambutan Hari Raya.

## 📋 Features

- ✅ Borang pendaftaran online
- ✅ D1 Database (Cloudflare)
- ✅ Admin dashboard dengan statistik
- ✅ Export CSV
- ✅ Responsive design (mobile-friendly)
- ✅ Tema Hari Raya
- ✅ Logo sekolah

## 🚀 Setup & Deployment

### Step 1: Create D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create kehadiran-pibg
```

Copy the `database_id` from the output.

### Step 2: Update wrangler.toml

Edit `wrangler.toml` and replace `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "kehadiran-pibg"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Replace this
```

### Step 3: Create Database Tables

```bash
# Run schema to create tables
wrangler d1 execute kehadiran-pibg --file=schema.sql
```

### Step 4: Deploy to Cloudflare Pages

```bash
# Deploy
wrangler pages deploy . --project-name=kehadiran-pibg
```

### Step 5: Bind D1 Database

```bash
# Bind D1 to Pages project
wrangler pages project update kehadiran-pibg \
  --d1-binding=DB \
  --d1-database=kehadiran-pibg
```

### Step 6: Redeploy

```bash
# Redeploy to apply bindings
wrangler pages deploy . --project-name=kehadiran-pibg
```

## 📊 URLs

- **Form:** https://kehadiran-pibg.pages.dev
- **Admin:** https://kehadiran-pibg.pages.dev/admin.html

## 🗄️ Database Schema

```sql
CREATE TABLE kehadiran_pibg (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendee_count INTEGER DEFAULT 1,
  students TEXT NOT NULL,  -- JSON array
  event_id TEXT DEFAULT 'pibg-hari-raya-2026',
  submitted_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

### POST /api/submit
Submit new registration

```json
{
  "parentName": "Ahmad bin Abu",
  "phone": "012-345 6789",
  "attendeeCount": 2,
  "students": [
    {"name": "Ali bin Ahmad", "class": "1 Anggerik"}
  ],
  "eventId": "pibg-hari-raya-2026"
}
```

### GET /api/data
Get all registration data (for admin dashboard)

### GET /api/export
Export data as CSV

## 📱 Form Fields

### Ibu Bapa / Penjaga
- Nama (required)
- No. Telefon (required)
- Bilangan Hadir (required, 1-10)

### Murid
- Nama Murid (required)
- Kelas (required)
  - 1 Anggerik
  - 2 Mawar
  - 3 Cempaka
  - 4 Dahlia
  - 5 Kekwa
  - 6 Matahari
  - Prasekolah
  - PPKI

## 🎨 Event Details

- **Event:** Mesyuarat Agung PIBG & Sambutan Hari Raya
- **Date:** 11 April 2026 (Sabtu)
- **Time:** 8:00 Pagi - 12:00 Tengah Hari
- **Venue:** Dewan Utama, SK Masjid Tanah

## 📊 Admin Features

- Total registrations count
- Total adult attendees
- Total students
- Breakdown by class (chart)
- Registration trend (chart)
- Searchable data table
- Export to CSV

## 🔐 Security Notes

- CORS enabled for all origins (configure for production)
- Input validation on form submission
- D1 database with parameterized queries (SQL injection safe)

## 📝 Notes

- Maximum 10 students per registration
- Form is mobile-responsive
- Auto-refresh admin dashboard every 30 seconds
- All times in Asia/Kuala_Lumpur timezone

## 🛠️ Development

### Local Testing

```bash
# Run Pages dev server with D1
wrangler pages dev . --d1=kehadiran-pibg
```

### View Database

```bash
# Query database
wrangler d1 execute kehadiran-pibg --command="SELECT * FROM kehadiran_pibg LIMIT 10"
```

## 📞 Support

For issues or questions, contact:
- SU PIBG: 012-345 6789 (Pn. Aminah)
- Email: admin@skmasjidtanah.edu.my

---

© 2026 SK Masjid Tanah - PIBG
