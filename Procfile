release: pipenv run upgrade
web: gunicorn wsgi --chdir ./src/
web: pipenv run gunicorn src.app:app

