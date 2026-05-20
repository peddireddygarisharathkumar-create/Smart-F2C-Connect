"""
seed_db.py – Run once after creating the database to seed sample data.
Usage: python seed_db.py
"""
import pymysql
from werkzeug.security import generate_password_hash

DB = 'f2c.db'

def seed():
    conn = pymysql.connect(host='localhost', user='root', password='', database='f2c_connect')
    cur  = conn.cursor()

    # Clear existing data
    cur.execute("DELETE FROM admins")
    cur.execute("DELETE FROM farmers")
    cur.execute("DELETE FROM consumers")
    cur.execute("DELETE FROM products")
    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM order_items")
    
    # Admin
    cur.execute("INSERT INTO admins (name,email,phone,password) VALUES (%s,%s,%s,%s)",
                ('Super Admin','admin@f2c.com','9999999999', generate_password_hash('admin@123')))

    # Farmers
    farmers = [
        ('Ramu Reddy','ramu@farm.com','9876543210', generate_password_hash('farmer@123'),'Reddy Organics','Kurnool, AP'),
        ('Lakshmi Devi','lakshmi@farm.com','9876543211', generate_password_hash('farmer@123'),'Green Valley Farm','Nellore, AP'),
        ('Venkat Rao','venkat@farm.com','9876543212', generate_password_hash('farmer@123'),'Rao Agro Farm','Guntur, AP'),
    ]
    cur.executemany("INSERT INTO farmers (name,email,phone,password,farm_name,location) VALUES (%s,%s,%s,%s,%s,%s)", farmers)

    # Consumers
    consumers = [
        ('Arjun Sharma','arjun@email.com','9123456780', generate_password_hash('consumer@123'),'12, MG Road, Hyderabad'),
        ('Priya Nair','priya@email.com','9123456781', generate_password_hash('consumer@123'),'45, Anna Nagar, Chennai'),
    ]
    cur.executemany("INSERT INTO consumers (name,email,phone,password,address) VALUES (%s,%s,%s,%s,%s)", consumers)

    # Products (Skipped to start with a clean slate)

    conn.commit()
    cur.close()
    conn.close()
    print("[SUCCESS] Database seeded successfully!")
    print("\nCredentials:")
    print("  Admin    -> admin@f2c.com  / admin@123")
    print("  Farmer   -> ramu@farm.com  / farmer@123")
    print("  Consumer -> arjun@email.com/ consumer@123")

if __name__ == '__main__':
    seed()
