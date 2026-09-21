import sqlite3
conn = sqlite3.connect('pathward.db')
conn.execute("UPDATE alembic_version SET version_num='30d943549662'")
conn.commit()
