import sqlite3
conn = sqlite3.connect('pathward.db')
print("Alembic version:", conn.execute('SELECT * FROM alembic_version').fetchall())
for row in conn.execute("SELECT name, sql FROM sqlite_master WHERE type='table'"):
    if 'learning' in row[0]:
        print(f"Table: {row[0]}\nSQL: {row[1]}\n")
