const request = require('supertest');
const app = require('../app');
const { Book, Loan, Member, sequelize } = require('../models');
const { queryInterface } = sequelize;

const member1 = {
  name: 'Hary Dhimas Prakoso',
  address: 'Jakarta',
  zipcode: '17414',
  email: 'hardhim@mail.com',
  phone_number: '+628123456789',
};

const book1 = {
  isbn: '9781593279509',
  title: 'Eloquent JavaScript',
  author: 'Marijn Haverbeke',
  category: 'Programming',
  stock: 10,
};

let loanId = null

afterAll(done => {
  queryInterface
    .bulkDelete('Members', {})
    .then(() => queryInterface.bulkDelete('Books'))
    .then(() => queryInterface.bulkDelete('Loans'))
    .then(() => done())
    .catch(err => done(err));
});

beforeAll(done => {
  Book
    .create(book1)
    .then(book => {
      book1.id = book.id
      return Member.create(member1)
    })
    .then(member => {
      member1.id = member.id
      done()
    })
    .catch(err => done(err))
})

describe('Loan Routes Test', () => {
  describe('POST /loans - Create new Loan', () => {
    test(`Should return status 201 and object of new loan`, function (done) {
      const date_loaned = new Date()
      const data = {
        MemberId: member1.id,
        BookId: book1.id,
        date_loaned
      };
      request(app)
        .post('/loans')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('MemberId', data.MemberId);
          expect(body).toHaveProperty('BookId', data.BookId);
          expect(body).toHaveProperty('date_loaned');
          expect(body).toHaveProperty('date_returned', null);
          loanId = body.id
          done();
        });
    })
  })
  describe('POST /loans - Errors when creating new loan', () => {
    test('Should send an error - (Empty Body, code: 400)', (done) => {
      const expectedErrors = ["MemberId is required", "BookId is required", "Date loaned is required"]
      request(app)
        .post('/loans')
        .send({})
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })
  })
  describe('GET /loans - findAll loan', () => {
    test(`Should return status 200 and array of object loan`, function (done) {
      request(app)
        .get('/loans')
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body.length).toBe(1)
          const firstData = body[0]
          expect(firstData).toHaveProperty('id', expect.any(Number));
          expect(firstData).toHaveProperty('MemberId', member1.id);
          expect(firstData).toHaveProperty('BookId', book1.id);
          expect(firstData).toHaveProperty('date_loaned');
          expect(firstData).toHaveProperty('date_returned', null);
          done();
        });
    })
  })
  describe('PATCH /loans - update returned date', () => {
    test(`Should return status 200 and success message`, function (done) {
      const date_returned = new Date()
      const data = {
        date_returned 
      };
      request(app)
        .patch('/loans/' + loanId)
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty('message', 'Successfully returned');
          done();
        });
    })
  })
})
