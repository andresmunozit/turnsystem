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

// Get many users
test('Should return all the users', async () => {
    let response;

    response = await request(app)
        .get('/users')
        .send()
        .expect(200);

    response = await request(app)
        // .get('/users?sort=&find=&limit=&skip=')
        .get('/users?sort=')
        .send()
        .expect(200);
});

test('Should sort by name', async () => {
    const response = await request(app)
        .get('/users?sort[name]=-1')
        .send()
        expect(200);
    expect(response.body.data.users.map( user => user.name))
        .toEqual(['Patrick','Missouri','Eleazar','Deondre']);
});

test('Should sort several fields', async () => {
    const response = await request(app)
        .get('/users?sort[email]=1&sort[name]=-1')
        .send()
        .expect(200);
    expect(response.body.data.users.map( user => user.email))
        .toEqual([
            'Deondre.Mante@yahoo.com',
            'Eleazar.Cremin32@hotmail.com',
            'Missouri_Feest@gmail.com',
            'Patrick_Bauch30@yahoo.com'
        ]);
});

test('Should ignore inexistent fields', async () => {
    const response = await request(app)
        .get('/users?sort[number]=1')
        .send()
        expect(200);
});

test('Should ignore not numeric values when sort', async () => {
    let response;
    response = await request(app)
        .get('/users?sort[email]=text')
        .send()
        expect(200);

    response = await request(app)
        .get('/users?sort[email]=""')
        .send()
        expect(200);

    response = await request(app)
        .get('/users?sort[email]={key:value}')
        .send()
        expect(200);
});


test('OK when filter is empty', async () => {
    let response;
    response = await request(app)
        // .get('/users?sort=&find=&limit=&skip=')
        .get('/users?sort=&find=')
        .send()
        .expect(200);
});

test('Should filter by exact match', async () => {
    const response = await request(app)
        .get('/users?filter[name]=Eleazar')
        .send()
        .expect(200);

    expect(response.body.data.users.length)
        .toBe(1);

    expect(response.body.data.users[0].email)
        .toBe('Eleazar.Cremin32@hotmail.com');
});

test('Should filter by coincidence', async () => {
    const response = await request(app)
        .get('/users?filter[email][like]=yahoo')
        .send()
        .expect(200);

    expect(response.body.data.users.length)
        .toBe(2);

    expect(response.body.data.users.map( user => user.email))
        .toEqual([
            'Deondre.Mante@yahoo.com',
            'Patrick_Bauch30@yahoo.com'
        ] );
});

test('Should filter by coincidence and exact match', async () => {
    const response = await request(app)
        .get('/users?filter[email][like]=yahoo&filter[name]=Deondre')
        .send()
        .expect(200);

    expect(response.body.data.users.map( user => user.email))
        .toEqual([
            'Deondre.Mante@yahoo.com',
        ]);
});

test('Should return 2 records', async () =>{
    const response = await request(app)
        .get('/users?limit=2')
        .send()
        .expect(200);
    expect(response.body.data.users.length)
        .toBe(2);
});

test('Should return an error if limit is an string', async () =>{
    const response = await request(app)
        .get('/users?limit=test')
        .send()
        .expect(500);
    expect(response.body)
        .toEqual({error: 'Limit must be an integer'})
});

test('Should return 3 items, when a negative integer is passed', async () =>{
    const response = await request(app)
        .get('/users?limit=-3')
        .send()
        .expect(200);
    expect(response.body.data.users.length)
        .toBe(3)
});

test('Skip negative values should return error', async () =>{
    const response = await request(app)
        .get('/users?skip=-1')
        .send()
        .expect(500);
    expect(response.body)
        .toEqual({error: 'Skip value must be a positive integer'});
});

test('Skip decimals should use the integer part', async () =>{
    const response = await request(app)
        .get('/users?skip=2.8')
        .send()
        .expect(200);
    expect(response.body.data.users.length)
        .toBe(2);
});

test('Skip decimals should use the integer part', async () =>{
    const response = await request(app)
        .get('/users?skip=test')
        .send()
        .expect(500);
    expect(response.body)
        .toEqual({error: 'Skip must be an integer'});
});

test('Should return two registers sorted by email descending', async () =>{
    const response = await request(app)
        .get('/users?sort[email]=-1&limit=2&skip=1')
        .send()
        .expect(200)
    expect(response.body.data.users.map( user => user.email ))
        .toEqual(['Missouri_Feest@gmail.com','Eleazar.Cremin32@hotmail.com']);
});

test('Should return one registers on a second page', async () =>{
    const response = await request(app)
        .get('/users?filter[email][like]=yahoo&sort[lastname]=1&limit=1&skip=1')
        .send()
        .expect(200)
    expect(response.body.data.users.map( user => user.name ))
        .toEqual(['Deondre']);
});