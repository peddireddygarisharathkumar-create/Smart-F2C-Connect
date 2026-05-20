import re

with open('app.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('        db = get_db()\n    cur = db.cursor()', '        cur = get_db().cursor()')
code = code.replace('    db = get_db()\n    cur = db.cursor()', '    cur = get_db().cursor()')
code = code.replace('db.commit()', 'get_db().commit()')

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(code)
