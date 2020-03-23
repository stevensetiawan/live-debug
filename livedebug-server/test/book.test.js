const request = require('supertest');
const app = require('../app');
const { Book, sequelize } = require('../models');
const { queryInterface } = sequelize;

afterAll(done => {
  queryInterface
    .bulkDelete('Books', {})
    .then(() => done())
    .catch(err => done(err));
});

describe('Book Routes Test', () => {
  describe('Create new Books', () => {
    test(`Should return status 201 and object of new book`, function (done) {
      const data = {
        isbn: '9781593279509',
        title: 'Eloquent JavaScript',
        author: 'Marijn Haverbeke',
        category: 'Programming',
        stock: 10,
      };
      request(app)
        .post('/books')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('isbn', data.isbn);
          expect(body).toHaveProperty('title', data.title);
          expect(body).toHaveProperty('author', data.author);
          expect(body).toHaveProperty('category', data.category);
          expect(body).toHaveProperty('stock', data.stock);
          done();
        });
    })
  })
  describe('Errors when creating book', () => {
    test('Should send an error - (Empty Body, code: 400)', (done) => {
      const expectedErrors = ['ISBN is required', 'Title is required', 'Author is required', 'Category is required', 'Stock is required']
      request(app)
        .post('/books')
        .send({})
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })

    test('should send an error - (Invalid ISBN length, code: 400)', function (done) {
      const data = {
        isbn: '978159327',
        title: 'Eloquent JavaScript',
        author: 'Marijn Haverbeke',
        category: 'Programming',
        stock: 10,
      };
      const expectedErrors = ['Invalid ISBN length']
      request(app)
        .post('/books')
        .send(data)
        .then(response => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty('errors', expect.any(Array));
          expect(body.errors).toEqual(expect.arrayContaining(expectedErrors));
          done();
        });
    })

    test('should send an error - (Stock with negative number, code: 400)', (done) => {
      const data = {
        isbn: '9781593279509',
        title: 'Eloquent JavaScript',
        author: 'Marijn Haverbeke',
        category: 'Programming',
        stock: -1,
      };

      const expectedErrors = ['Validation min on stock failed']
      request(app)
        .post('/books')
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
