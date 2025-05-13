#!/bin/bash

# Wacht tot de objecten-api beschikbaar is (max 12 pogingen, met telkens 10 seconden pauze)
c=0
while ! curl -s http://objecten-api:8000 > /dev/null; do
    c=$((c + 1))
    echo "objecten-api niet bereikbaar, poging $c van 12..."
    if [ "$c" -eq 12 ]; then
        echo "objecten-api niet beschikbaar na 12 pogingen. Afbreken."
        exit 1
    fi
    sleep 10
done

# Laad demodata in de database
echo "Demodata laden..."
python /app/src/manage.py loaddata demodata

# Maak een admin superuser aan, als deze nog niet bestaat
echo "Superuser 'admin' aanmaken indien nodig..."
echo "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.org', 'admin')
" | python /app/src/manage.py shell
