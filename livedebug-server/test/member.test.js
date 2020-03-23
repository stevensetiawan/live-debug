const request = require('supertest');
const app = require('../app');
const { Book, sequelize } = require('../models');
const { queryInterface } = sequelize;

afterAll(done => {
  queryInterface
    .bulkDelete('Members', {})
    .then(() => done())
    .catch(err => done(err));
});

describe('Member Routes Test', () => {
  describe('Create new Member', () => {
    test(`Should return status 201 and object of new member`, function (done) {
      const data = {
        name: 'Hary Dhimas Prakoso',
        address: 'Jakarta',
        zipcode: '17414',
        email: 'hardhim@mail.com',
        phone_number: '+628123456789',
      };
      request(app)
        .post('/members')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('name', data.name);
          expect(body).toHaveProperty('address', data.address);
          expect(body).toHaveProperty('zipcode', data.zipcode);
          expect(body).toHaveProperty('email', data.email);
          expect(body).toHaveProperty('phone_number', data.phone_number);
          done();
        });
    })
  })
  describe('Errors when creating new member', () => {
    test('Should send an error - (Empty Body, code: 400)', (done) => {
      const expectedErrors = ["Name is required", "Name is required", "Zipcode is required", "Email is required", "Phone Number is required"]
      request(app)
        .post('/members')
        .send({})
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })

    test('should send an error - (Duplicate Email, code: 400)', function (done) {
      const data = {
        name: 'Hary Dhimas Prakoso',
        address: 'Jakarta',
        zipcode: '17414',
        email: 'hardhim@mail.com',
        phone_number: '+628123456789',
      };
      const expectedErrors = ['Email is already in use']
      request(app)
        .post('/members')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })

    test('should send an error - (Duplicate Phone Number, code: 400)', function (done) {
      const data = {
        name: 'Hary Dhimas Prakoso',
        address: 'Jakarta',
        zipcode: '17414',
        email: 'pururung@mail.com',
        phone_number: '+628123456789',
      };
      const expectedErrors = ['Phone Number is already in use']
      request(app)
        .post('/members')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })

    test('should send an error - (Invalid Phone Number Length > 13, code: 400)', function (done) {
      const data = {
        name: 'Hary Dhimas Prakoso',
        address: 'Jakarta',
        zipcode: '17414',
        email: 'pururung@mail.com',
        phone_number: '+628123456789121212',
      };
      const expectedErrors = ['Invalid Phone Number length']
      request(app)
        .post('/members')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })

    test('should send an error - (Invalid Phone Number Length < 10, code: 400)', function (done) {
      const data = {
        name: 'Hary Dhimas Prakoso',
        address: 'Jakarta',
        zipcode: '17414',
        email: 'pururung@mail.com',
        phone_number: '+628123',
      };
      const expectedErrors = ['Invalid Phone Number length']
      request(app)
        .post('/members')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })
  })
})
