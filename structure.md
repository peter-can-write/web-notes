# Structure of a Web Application

## *Learning How to Build a Web Application*

https://medium.com/@rchang/learning-how-to-build-a-web-application-c5499bd15c8f#.udz854viz

A client makes requests to a web server via HTTP. The web server responds with the requested resource, if possible, through an HTTP response. More precisely, the web server will most likely interact with a database in the background, from which it fetches information.

There are generally three layers to any web application:

* Front-End Layer: The View, where HTML, CSS and Javascript create the look and feel and layout of the website -- i.e. everything that faces the user.
* Back-End (Application) Layer: The controller, which combines front-end presentation logic with back-end storage and coordination logic.
* Database Storage Layer: The model, which stores the data that is visualized and represented in some way.

Let us now investigate these layers in further detail.

### Application Layer

The application layer is responsible for deciding what information should be returned to the user given an incoming request. Web Frameworks like Flask use the concept of *routes* and *templates* to "route" the user to resources and "personalize" template files with information specific to the request.

#### Routes

In Flask, a *route* is a directive that notifies the Flask framework that a function exists in code (that you define) which is responsible for answering, i.e. providing data, a request for a resource under a given URI. That is, given a request for URI `foo.bar/baz`, we can tell Flask what to respond to the user.

We do this simply by creating a function and decorating it with a flask-specific decorator. This could look like so:

```Python
@webapp.route('baz')
def baz():
  return "baz"
```

In this case, our web application will return the plain-text string `baz`. The Flask web framework will then proceed to create an HTTP response, which is shown in the user's browser.

#### Templates

Flask is paired with a *template engine*, called *Jinja*. With Jinja, we can define HTML files with a specific syntax similar to `str.format()` in Python, where we leave placeholders for data that we fill in later. An example could look like this:

```HTML
{% extends "base.html" %}

{% block title %} Example {% endblock %}

{% block content %}

{{ placeholder }}

{% endblock %}
```

What we've done here is define an HTML file with *directives* and *placeholders*. For example, we can see that we can `extend`, i.e. inherit from, another HTML file. This is useful, since we may not want to define the `<html>`, `<body>` and other tags for each file.

Most importantly, `{{ placeholder }}` defines a placeholder for custom content, which we can supply later like so:

```Python
@webapp.route('baz')
def baz():
  return flask.render_template('file.html', placeholder=5)
```

Here we supplied the integer `5` as the placeholder, which would be shown in the HTML.

## Data Layer

The application layer is responsible for answering requests supplied by the user with responses. Often, those responses will contain information specific to the user or at least to the request, which must be gathered somehow. Usually, such information -- i.e. data -- is stored in a database.

To access a database in code, we have two options. We can either use an explicit database connector, e.g. for SQLite3 or PostGres, or an *object relational mapper* (*ORM*).

With the explicit database connector, we usually have to transmit our queries and directives (e.g. to create a table) via strings. This is of course not flexible or scalable. An ORM is better suited for database interaction, because it maps relations to objects, i.e. our database models to actual code. As such, we can define our relation as a class and actually interact with it through methods. In Flask, this works with the `SQLAlchemy` extension. It allows us to create a class relation (table) like so:

```Python
class Events(db.Model):
  __tablename__ = 'events'
  id = Column(Integer, primary_key=True)
  date = Column(Date)
  duration = Column(Float)
  event_type = Column(String)
  event_name = Column(String)
```

Later on, in a route, we can query this table via functional methods in a fashion similar to SQL, for example:

```Python
@webapp.rotue('show/some/events')
def show_some_events():
  return flask.render_template("show.html", events=(Events.query.filter_by("name=foo").all()))
```

## What is a Web Framework

http://jeffknupp.com/blog/2014/03/03/what-is-a-web-framework/

Communication in the web happens via HTTP requests, which consist of request/response pairs. A client, usually a web browser with which a user interact, sends an HTTP request to a *web application*, on behalf of the user. The web application, in turn, acts as a *web server*. A web server is responsible for providing a corresponding HTTP response for a given request. There are many kinds of request, called *methods*, albeit the two most common are `GET` and `POST`. The former requests a resource from the server without side effects, i.e. without changes to the state of the web application. The latter requests an addition to the web application's state, usually a database (e.g. when adding a new user).

The simplest way we could construct a web server in Python is using good old sockets, like in C. That is, we would retrieve a listener socket via the `socket` system call, `bind` it to an IP address and port, start `listen`ing on it and lastly `accept` incoming connections. Then, we could read requests on that socket and return HTTP responses:

```Python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('', 8080)) # address, port
server.listen(10)
client, _ = server.accept()
request = client.recv(1024) # read the request
client.sendall("""HTTP/1.1 200 OK
Content-type: text/html


<html>
    <body>
        <h1>Hello, World!</h1>
    </body>
</html>""")
client.close()
```

As you can see, we respond with status code `200`, indicating that everything worked OK. However, this server will obviously not scale well. How will we handle thousands of incoming requests concurrently? How do we handle other request methods, such as `POST` or `PUT` requests? And what if there was an error? Will we always return error code 200? Hopefully not.

There seems to be quite a bit of work left to do. This is where web frameworks such as Flask or Django come in to help. They solve two main problems: *routing* and *templates*. Routing concerns itself with mapping requested URIs (resources) to code to handle such requests. Templates allow us to change our responses in accordance with the data or information retrieved to accommodate the request. This all aligns with the *model-view-controller* (MVC) pattern. Templates are the view, routing is the controller and the database is the model in the background.

Templates are like `str.format`, i.e. they allow the replacement of placeholders with actual values, supplied at a later point in time. Flask uses the Jinja template engine, while Django uses its own engine. Jinja allows very complex code statements to be executed and caches whatever it renders (i.e. formats) very aggressively, such that an HTML template that was already rendered with a set of arguments need not be re-rendered when the same arguments are passed again shortly after.

## 8 Steps to Building an App from Scratch

https://www.codementor.io/learn-programming/how-to-build-app-from-scratch-beginner-programmer

You have an idea for a web app -- but how do you realize it? The steps recommended above are:

1. Sketch your app: Make simple drawings of your app and what it should look like, what buttons and knobs you'll have and what they're supposed to do.
2. Plan your app's flow: Make a full-fletched control-flow diagram of the user-interaction. I.e. the entire login process, what each button does, what happens when the user inputs bad data, forgot his/her password etc.
3. Design the database: Thinks of the entities and relationships of you database and create an entity-relationship diagram.
4. Mockup the site: Do a full UI mockup of the site using a tool like https://www.invisionapp.com/
5. Setup infrastructure
6. Tests first
7. Code second
