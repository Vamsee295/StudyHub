import psutil

for conn in psutil.net_connections(kind='inet'):
    if conn.laddr.port == 8000:
        try:
            p = psutil.Process(conn.pid)
            print(f"Killing {p.name()} (PID {conn.pid})")
            p.kill()
        except Exception as e:
            print(f"Failed to kill {conn.pid}: {e}")
