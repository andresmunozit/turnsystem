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
##  API Reference
### Sorting
Sorting by a unique field is supported. The query string "sort=name" or "sort=-name" must be used to sort the field "name" in ascending or descending way respectivelly. No exception is thrown if the field doesn't exist for a query, the API will just ignore it.
#### Example:
Sorting the queues by code, descending:
```
[SERVER_URL]/queues?sort=-code
```