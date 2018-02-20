const server = require('../../server');

describe('check server response code', () => {
  test('/books/savebooks should respond with status code 200', (done) => {
    const request = {
      method: 'POST',
      url: '/books/savebooks',
    };
    server.inject(request, (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  test('/books/savebooks should respond with status code 200', (done) => {
    const request = {
      method: 'POST',
      url: '/books/savebooks',
    };
    server.inject(request, (response) => {
      expect(response.result.statusCode).toBe(201);
      done();
    });
  });

  test('/books/like/id should respond with status code 201', (done) => {
    const request = {
      method: 'POST',
      url: '/books/like/3',
    };
    server.inject(request, (response) => {
      expect(response.result.statusCode).toBe(201);
      done();
    });
  });

  test('/books/like/id should respond with status code 400', (done) => {
    const request = {
      method: 'POST',
      url: '/books/like/16',
    };
    server.inject(request, (response) => {
      expect(response.result.statusCode).toBe(400);
      done();
    });
  });

  test('/books/like/id should respond with status code 201', (done) => {
    const request = {
      method: 'POST',
      url: '/books/dislike/3',
    };
    server.inject(request, (response) => {
      expect(response.result.statusCode).toBe(201);
      done();
    });
  });

  test('/books/like/id should respond with status code 400', (done) => {
    const request = {
      method: 'POST',
      url: '/books/dislike/16',
    };
    server.inject(request, (response) => {
      expect(response.result.statusCode).toBe(400);
      done();
    });
  });
});
