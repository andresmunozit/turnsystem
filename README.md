# Turn System
This is a web application that helps to manage turn queue environments as banks, public institutions, etc.
It is developed using JavaScript ES6/ESNext, Node.js, and a MongoDB database.
The project is being developed using Docker and Docker Compose.

## Current Status
This application is currently under development.
Here is the Product Backlog of the project:
https://docs.google.com/spreadsheets/d/1rGz-jkecBtnhbQdWe9PoH9tLc64BuAyrOapJXg6_ka0/edit?usp=sharing

## Development Environment
Create the file 'config/dev.env' with the environment variables for development. The file must contain the following key-value pairs (the values can be changed):
```
PORT=3000
DB_PATH=mongodb://db:27017/turnsystem
```
To run the development environment, install Docker and Docker Compose, and then run the following commands:
```
docker-compose build
docker-compose up
```
Then go to http://localhost:3000/test, you should see the following:
```
{
    "message": "Ok"
}
```
## Web Container Management
To get into the container bash, you can use the container ID or the container name.
#### Example
To list the running containers:
```
$ docker container ls
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
48c282492907        turnsystem_web      "docker-entrypoint.s…"   29 hours ago        Up 29 hours         0.0.0.0:3000->3000/tcp     turnsystem_web_1       
7e754480885b        mongo:4.2.5         "docker-entrypoint.s…"   30 hours ago        Up 29 hours         0.0.0.0:27017->27017/tcp   turnsystem_db_1 
```
You can use the container ID "48c282492907" or the container name "turnsystem_web_1"
#### Example
To get into the web container's bash:
```
docker exec -it turnsystem_web_1 /bin/bash
```
or
```
docker exec -it 48c282492907 /bin/bash
```
## API Reference
### Sorting
Sorting by a unique field is supported. The query string "sort=name" or "sort=-name" must be used to sort the field "name" in ascending or descending way respectivelly. No exception is thrown if the field doesn't exist for a query, the API will just ignore it.
#### Example:
Sorting the queues by code, descending:
```
[SERVER_URL]/queues?sort=-code
```
### Pagination
Limit and skip parameters are supported. This feature can be chained with sorting. The pagination will always take effect after filtering and sorting.
Negative signs and string values are ignored for limit and skip parameters on pagination.
#### Example:
To get 10 queues from the queue 20, sorted ascending by name:
```
[SERVER_URL]/queues?sort=name&limit=10&skip=20
```
When the limit parameter is greater than the number of documents, after filtering (filtering currently under development), the endpoint returns pagination links into the meta attribute.
#### Example:
```
...
"meta": {
    "pagination": {
        "first": "/queues?sort=name&limit=2",
        "previous": "/queues?sort=name&limit=2&skip=2",
        "next": "/queues?sort=name&limit=2&skip=6",
        "last": "/queues?sort=name&limit=2&skip=8"
    }
}
```
### Filtering
Filtering by several keys is allowed. The query string "...?fiter=key1=value1,key2=value2" must be used to filter documents. Right now, the values in the filters must be exactly the same that the filtered values. Filters are case sensitive. If the number of filtered keys in the HTTP request, is greater than the schema keys, the system will return an error. If one or more keys sent in the filter query, doesn't belong to the schema keys, the system will return an error. Advanced filters like ($gte) will be implemented on future versions.
#### Example:
To filter a queue named Loans, the following HTTP request must be used:
```
[SERVER_URL]/queues?fiter=name:Loans
```