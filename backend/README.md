## Backend Setup

### Basic System Prerequisites:
```
Python >= 3.6
pip >= 18.1
virtualenv >= 16.0.0
```

### Fork this repo and run these commands after cloning the project and go inside the ```backend``` directory:
```
virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```
### Note: <br> 1) Don't forget to run ``` black BEProjectsApp/ and black BEProjectsWeb/``` before adding or committing or pushing any code otherwise, the code won't be formatted properly and you might end up getting Travis CI Build fails.
