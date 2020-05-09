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