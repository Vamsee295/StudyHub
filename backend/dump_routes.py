from app.main import app

def print_routes(app, prefix=""):
    for route in app.routes:
        path = getattr(route, "path", None)
        if hasattr(route, "app"):
            print_routes(route.app, prefix + path if path else prefix)
        else:
            print(f"{prefix}{path} [{getattr(route, 'methods', None)}]")

print_routes(app)
