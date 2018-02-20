const server = require('../../server');
const { result } = require('./object');

describe('check server response code', () => {
  test('/books should respond with status code 200', (done) => {
    server.inject('/books', (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('/books should return same object as required', (done) => {
    server.inject('/books', (response) => {
      expect(response.result).toEqual(result);
      done();
    });
  });
});

