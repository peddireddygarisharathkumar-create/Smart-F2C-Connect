import re

with open('app.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('from flask_mysqldb import MySQL', 'import sqlite3\nfrom flask import g')
code = code.replace('mysql = MySQL(app)', '''DATABASE = 'f2c.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
''')

code = re.sub(r'# ── MySQL Config ──.*?MYSQL_CURSORCLASS\\] = \'DictCursor\'\n+', '', code, flags=re.DOTALL)

code = code.replace('cur = mysql.connection.cursor()', 'db = get_db()\n    cur = db.cursor()')
code = code.replace('mysql.connection.commit()', 'db.commit()')

code = code.replace('%s', '?')

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Done converting app.py')

# Also convert seed_db.py
try:
    with open('seed_db.py', 'r', encoding='utf-8') as f:
        seed_code = f.read()
    seed_code = seed_code.replace('import MySQLdb', 'import sqlite3')
    seed_code = re.sub(r'DB = dict\(.*?\)\n', "DB = 'f2c.db'\n", seed_code)
    seed_code = seed_code.replace('MySQLdb.connect(**DB)', 'sqlite3.connect(DB)')
    seed_code = seed_code.replace('%s', '?')
    seed_code = seed_code.replace('IGNORE ', '') # SQLite uses INSERT OR IGNORE, let's fix it later. Or just re.sub
    seed_code = seed_code.replace('INSERT IGNORE INTO', 'INSERT OR IGNORE INTO')
    with open('seed_db.py', 'w', encoding='utf-8') as f:
        f.write(seed_code)
except Exception as e:
    print('Seed err:', e)

# Also convert schema.sql
try:
    with open('schema.sql', 'r', encoding='utf-8') as f:
        schema_code = f.read()
    
    # SQLite schema changes
    schema_code = schema_code.replace('AUTO_INCREMENT', 'AUTOINCREMENT')
    schema_code = re.sub(r'CREATE DATABASE IF NOT EXISTS f2c_connect.*?;', '', schema_code, flags=re.IGNORECASE)
    schema_code = re.sub(r'USE f2c_connect;', '', schema_code, flags=re.IGNORECASE)
    schema_code = schema_code.replace('INSERT IGNORE', 'INSERT OR IGNORE')
    schema_code = re.sub(r'ENUM\(.*?\)', 'TEXT', schema_code) # SQLite doesn't have ENUM, fallback to TEXT
    
    with open('schema.sql', 'w', encoding='utf-8') as f:
        f.write(schema_code)
except Exception as e:
    pass

