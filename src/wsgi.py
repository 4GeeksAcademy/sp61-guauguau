# This file was created to run the application on heroku using gunicorn.
# Read more about it here: https://devcenter.heroku.com/articles/python-gunicorn

from app import app, socketio

if __name__ == "__main__":
    socketio.run(app)


