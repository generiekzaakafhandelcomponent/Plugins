#!/bin/bash

c=0
while ! curl -s http://objecttypen-api:8000 > /dev/null; do
    c=$((c + 1))
    if [ "$c" -eq 12 ]; then
        echo "De API is niet beschikbaar na 12 pogingen. Stoppen."
        exit 1
    fi
    echo "Wachten op objecttypen-api... poging $c"
    sleep 10
done

# Laad demodata
python /app/src/manage.py loaddata demodata

# Maak een superuser aan
echo "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.org', 'admin')
" | python /app/src/manage.py shell
