import sys
import os

# Adiciona o backend ao path para podermos importar os módulos
backend_path = r"C:\pfc\kwanzaConnect-project\kwanzaConnect-API"
sys.path.append(backend_path)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

try:
    import django
    django.setup()
    print("Django setup SUCCESS: No startup errors found.")
except Exception as e:
    print(f"Django setup FAILED: {str(e)}")
    import traceback
    traceback.print_exc()
