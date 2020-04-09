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
## Tests
The application uses Jest for testing. Tests are executed in a different environment called "web_test" on the docker-compose.yml file. The tests are located into the /tests directory. When docker-compose is up, the tests are executed automatically with each change of the tested files or the test files. The output will be like this:
```
web_test_1  | PASS tests/helpers/filter.test.js
web_test_1  |   ✓ Should return a JSON object (equals filter) (3ms)
web_test_1  |   ✓ Should return a JSON object (like filter)
web_test_1  |   ✓ Should return a JSON object ($gte filter) (1ms)
web_test_1  |   ✓ Should return a JSON object ($gt filter)
web_test_1  |   ✓ Should return a JSON object ($lt filter)
web_test_1  |   ✓ Should return a JSON object ($lte filter) (1ms)
web_test_1  |
web_test_1  | Test Suites: 1 passed, 1 total
web_test_1  | Tests:       6 passed, 6 total
web_test_1  | Snapshots:   0 total
web_test_1  | Time:        2.942s, estimated 3s
web_test_1  | Ran all test suites related to changed files.
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
Filtering by more than one key is allowed. The filters must be provided in JSON format. At this moment, only the following filters area allowed.
#### Equals filter
It is the default filter and the input provided must be identical in ordet to get an answer. This filter is case sensitive. For example, to search the queue named "Loans":
##### Example
```
[SERVER_URL]/queues?filter={"name":"Loans"}
```
#### Like filter
Filter by similar text. This filter is case sensitive. For example, to search the queue which its name contains the string "withd" (like "Cash withdrawals"). The filtered string must be put between slashes (/):
##### Example
```
[SERVER_URL]/queues?filter={"name":"/withd/"}
```
#### "Greather than equals", "greather than", "less than" and "less than equals" filters
Comparative filters can be used too, like "Greather than equals" ($gte), "greather than" ($gt), "less than" ($lt) and "less than equals" ($lte).
##### Examples
To get the queues created after a date, including that date:
```
[SERVER_URL]/queues?filter={"createdAt":"$gte:2020-04-05"}

```