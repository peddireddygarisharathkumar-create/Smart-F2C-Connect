# 🌿 Smart F2C Connect – Setup & Deployment Guide

**Farmer to Consumer Connect | Final Year Project**

---

## 📁 Project Structure

```
f2c/
├── app.py                    # Main Flask application
├── seed_db.py                # Database seeder
├── schema.sql                # MySQL schema
├── requirements.txt
├── .env.example
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   └── uploads/              # Product images
├── templates/
│   ├── base.html
│   ├── dashboard_base.html
│   ├── index.html
│   ├── auth/
│   │   ├── register.html
│   │   ├── login.html
│   │   └── verify_otp.html
│   ├── farmer/
│   │   ├── dashboard.html
│   │   ├── products.html
│   │   ├── add_product.html
│   │   ├── edit_product.html
│   │   └── orders.html
│   ├── consumer/
│   │   ├── dashboard.html
│   │   ├── products.html
│   │   ├── cart.html
│   │   ├── checkout.html
│   │   ├── order_confirmation.html
│   │   ├── orders.html
│   │   └── order_detail.html
│   └── admin/
│       ├── dashboard.html
│       ├── users.html
│       ├── products.html
│       ├── orders.html
│       ├── order_detail.html
│       └── reports.html
└── docs/
    ├── uml_diagrams.html
    └── testing_report.html
```

---

## ⚙️ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.9+ | python.org |
| MySQL | 8.0+ | mysql.com |
| pip | Latest | (bundled with Python) |

---

## 🚀 Local Setup Steps

### Step 1 – Clone / Download Project
```bash
cd ~/Desktop
# extract or place the f2c/ folder here
```

### Step 2 – Create Virtual Environment
```bash
cd f2c
python -m venv venv

# Activate:
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### Step 3 – Install Dependencies
```bash
pip install -r requirements.txt
```

> **Windows note:** If `mysqlclient` fails, install the binary wheel:
> ```
> pip install mysqlclient --only-binary :all:
> ```
> Or use [pre-built wheels](https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient).

### Step 4 – Setup MySQL Database
```sql
-- In MySQL Workbench / phpMyAdmin / CLI:
CREATE DATABASE f2c_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then import the schema:
```bash
mysql -u root -p f2c_connect < schema.sql
```

### Step 5 – Configure Database in app.py
Edit `app.py` lines 14–18:
```python
app.config['MYSQL_HOST']     = 'localhost'
app.config['MYSQL_USER']     = 'root'
app.config['MYSQL_PASSWORD'] = 'YOUR_PASSWORD_HERE'
app.config['MYSQL_DB']       = 'f2c_connect'
```

### Step 6 – Seed Sample Data
```bash
# Edit seed_db.py line 4 – set your DB password
python seed_db.py
```
Output:
```
✅ Database seeded successfully!

Credentials:
  Admin    → admin@f2c.com   / admin@123
  Farmer   → ramu@farm.com   / farmer@123
  Consumer → arjun@email.com / consumer@123
```

### Step 7 – Run the Application
```bash
python app.py
```
Open browser: **http://localhost:5000**

---

## 📧 Email OTP Setup (Optional)

By default, OTPs are printed to the **server console** (development mode).

To enable real email delivery, create a `.env` file:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

> **Gmail:** Use an [App Password](https://myaccount.google.com/apppasswords), not your regular password.

---

## 🌐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@f2c.com | admin@123 |
| Farmer | ramu@farm.com | farmer@123 |
| Consumer | arjun@email.com | consumer@123 |

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `admins` | Admin accounts |
| `farmers` | Registered farmers |
| `consumers` | Registered consumers |
| `products` | Product listings |
| `orders` | Customer orders |
| `order_items` | Line items per order |

---

## 🌍 Production Deployment (PythonAnywhere)

1. Create a free account at [pythonanywhere.com](https://pythonanywhere.com)
2. Upload your project files via **Files** tab
3. Set up a **MySQL database** in the Databases tab
4. Create a **Web App** → Manual configuration → Python 3.11
5. Set WSGI file:
   ```python
   import sys
   sys.path.insert(0, '/home/yourusername/f2c')
   from app import app as application
   ```
6. Install dependencies in the console:
   ```bash
   pip3.11 install --user flask flask-mysqldb werkzeug
   ```
7. Set environment variables in the web app configuration
8. **Reload** the web app

---

## 🚀 Production Deployment (VPS / Ubuntu)

```bash
# Install dependencies
sudo apt install python3 python3-pip python3-venv mysql-server nginx

# Setup project
cd /var/www
git clone <repo> f2c && cd f2c
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt gunicorn

# Gunicorn service
gunicorn -w 4 -b 0.0.0.0:8000 app:app

# Nginx config
# Proxy pass to localhost:8000
```

---

## 🛡️ Security Features

- ✅ **Password Hashing** – Werkzeug PBKDF2-SHA256
- ✅ **OTP Verification** – 6-digit time-limited code
- ✅ **Role-based Access** – Separate decorators per role
- ✅ **SQL Injection Prevention** – Parameterized queries
- ✅ **XSS Prevention** – Jinja2 auto-escaping
- ✅ **File Upload Validation** – Allowed extensions only
- ✅ **Session Management** – Flask secure sessions

---

## 📊 Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11, Flask 3.0 |
| Database | MySQL 8.0 + Flask-MySQLdb |
| Frontend | HTML5, CSS3, Vanilla JS |
| Auth | OTP + Werkzeug password hashing |
| Charts | Chart.js 4.4 (CDN) |
| Fonts | Google Fonts (Playfair Display + DM Sans) |

---

## 📜 License

MIT License – Free for academic and educational use.

---

*Built with ❤️ for farmers and consumers | Smart F2C Connect 2026*
