const mongoose = require('mongoose');
const User = require('../../src/models/user');
const request = require('supertest');
const app = require('../../src/app');

const testUsers = [
    {email: 'Patrick_Bauch30@yahoo.com', name: 'Patrick', lastname: 'Bauch', idCard: '15031'},
    {email: 'Deondre.Mante@yahoo.com', name: 'Deondre', lastname: 'Mante', idCard: '80134'},
    {email: 'Eleazar.Cremin32@hotmail.com', name: 'Eleazar', lastname: 'Cremin', idCard: '56359'},
    {email: 'Missouri_Feest@gmail.com', name: 'Missouri', lastname: 'Feest', idCard: '9335'},
];

beforeAll( async () => {
    await User.deleteMany();
    await User.insertMany(testUsers);
});

afterAll( () => {
    mongoose.connection.close();
});

// Tests GET many users
test('Should get all users', async () => {
    const response = await request(app)
        .get('/users')
        .expect(200);
    expect(response.body.users.length).toBe(4);
});

test('Should sort in ascending order by email', async () => {
    const queryString = '?sort={"email":1}'
    const response = await request(app) 
        .get('/users'+ queryString)
        .expect(200);

    expect( response.body.users.map( user => user.email))
        .toEqual([
            'Deondre.Mante@yahoo.com',
            'Eleazar.Cremin32@hotmail.com',
            'Missouri_Feest@gmail.com',
            'Patrick_Bauch30@yahoo.com'
        ]);
});

test('Should sort in descending order by lastname', async () => {
    const queryString = '?sort={"lastname":-1}'
    const response = await request(app) 
        .get('/users'+ queryString)
        .expect(200);

    expect( response.body.users.map( user => user.lastname))
        .toEqual([
            'Mante',
            'Feest',
            'Cremin',
            'Bauch',
        ]);
});

test('Shouldn\'t sort by a value different from 1 or -1', async () => {
    const queryString = '?sort={"idCard":134}'
    const response = await request(app) 
        .get('/users'+ queryString)
        .expect(500);

    expect(response.body.error)
        .toBe('Invalid sort value for field "idCard", must be 1 or -1');
});

test('Should filter by name', async () => {
    const queryString = '?filter={"name":"Missouri"}'
    const response = await request(app) 
        .get('/users'+ queryString)
        .expect(200);
  
    expect(response.body.users.length).toBe(1);
    expect(response.body.users[0].name)
        .toEqual('Missouri');
});

test('Should filter by "yahoo" email and sort by name', async () => {
    const queryString = '?sort={"name":1}&filter={"email":{"regexp":"yahoo","options":"i"}}'
    const response = await request(app) 
        .get('/users'+ queryString)
        .expect(200);
  
    expect(response.body.users.length).toBe(2);
    expect(response.body.users.map( user => user.email ))
        .toEqual(['Deondre.Mante@yahoo.com','Patrick_Bauch30@yahoo.com']);
});

test.todo('Should return error message when the filter object is wrong');
test.todo('Should return error message when the filter object is empty');
test.todo('Should return error message when the filter regexp is incorrect');