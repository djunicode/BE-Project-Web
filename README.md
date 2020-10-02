<p>
    <h1 align='center'> DJ Archives </h1>
</p>

<h4 align='center'>Repository for CS Student Project Details Portal  </h4>

<br>
<br>
<br>

## File Structure

```
.
├── LICENSE
├── README.md
├── BEProjectsWeb -> Project configurations
├── BEProjectsApp -> Django app for endpoints
├── frontend -> React App
├── manage.py
└── requirements.txt
```

## Technology Stack

#### Backend

- Django 2.1.5 (Python 3.6+)
- Django REST Framework

#### Frontend
- React 16.13.1

## Build Instructions

#### Backend

```bash
  python3 -m venv venv
  venv\Scripts\activate
  pip3 install -r requirements.txt
  python3 manage.py makemigrations
  python3 manage.py migrate
  python3 manage.py runserver
```

#### Frontend
```bash
  cd frontend
  npm install
  npm start
```

## Development Instructions

Don't forget to run black BEProjectsApp/ and black BEProjectsWeb/ before adding or committing or pushing any code otherwise, the code won't be formatted properly and you might end up getting Travis CI Build fails

## Team

#### Developers

1. Jash Shah (Backend)
2. Aryan Chouhan (Backend)
3. Jash Mehta (Frontend)
4. Rohan Mistry (Frontend)

#### Mentors

Rashmil Panchani (Full Stack)

## License

> MIT License
>
> Copyright (c) 2020 Unicode
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.