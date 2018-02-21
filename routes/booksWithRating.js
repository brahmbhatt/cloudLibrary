
const rp = require('request-promise');
const Models = require('../models');

const exAPI1 = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks';
const exAPI2 = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/';
function groupbyAuthor(array) {
  const obj = {};
  for (let i = 0; i < array.length; i += 1) {
    if (obj[array[i].Author] === undefined) {
      obj[array[i].Author] = [].concat(array[i]);
    } else {
      obj[array[i].Author] = obj[array[i].Author].concat(array[i]);
    }
  }
  return obj;
}
const getBooksPromise = rp(exAPI1).then((data) => {
  let books = {};
  books = JSON.parse(data);
  return books;
});

const getAllRating = (bookArray) => {
  const promiseArray = [];
  for (let i = 0; i < bookArray.books.length; i += 1) {
    const bookId = bookArray.books[i].id;
    // console.log('bookId:', bookId);
    promiseArray[i] = rp(exAPI2 + bookId);
  }
  const booksAndPromise = {
    books: bookArray.books,
    promiseArray,
  };
  return booksAndPromise;
};

const routes = [{
  method: 'GET',
  path: '/books',
  handler: (request, response) => {
    getBooksPromise.then(getAllRating).then((booksAndPromise) => {
      Promise.all(booksAndPromise.promiseArray).then((ratingArray) => {
        for (let i = 0; i < booksAndPromise.books.length; i += 1) {
          booksAndPromise.books[i].rating = JSON.parse(ratingArray[i]).rating;
        }
        return (booksAndPromise.books);
      }).then((booksArray) => {
        response(groupbyAuthor(booksArray));
      });
    });
  },
},
{
  method: 'POST',
  path: '/books/savebooks',
  handler: (request, response) => {
    getBooksPromise.then(getAllRating).then((booksAndPromise) => {
      Promise.all(booksAndPromise.promiseArray).then((ratingArray) => {
        for (let i = 0; i < booksAndPromise.books.length; i += 1) {
          booksAndPromise.books[i].rating = JSON.parse(ratingArray[i]).rating;
        }
        return (booksAndPromise.books);
      }).then((booksArray) => {
        Models.books.destroy({
          where: {},
          truncate: true,
        });
        Models.favbooks.destroy({
          where: {},
          truncate: true,
        });
        for (let i = 0; i < booksArray.length; i += 1) {
          Models.books.create({
            Author: booksArray[i].Author,
            Name: booksArray[i].Name,
            bookId: booksArray[i].id,
            rating: booksArray[i].rating,
          });

          Models.favbooks.create({
            bookId: booksArray[i].id,
            like: 'false',
            dislike: 'true',
          });
        }
      }).then(() => {
        response({ statusCode: 201 });
      });
    });
  },
},
{
  method: 'POST',
  path: '/books/like/{id}',
  handler: (request, response) => {
    Models.favbooks.update(
      {
        dislike: 'false',
        like: 'true',
      },
      { where: { bookId: request.params.id } },
    ).then((rowObject) => {
      if (rowObject[0] === 1) { response({ statusCode: 201 }); } else {
        response({ statusCode: 400 });
      }
    });
  },
},
{
  method: 'POST',
  path: '/books/dislike/{id}',
  handler: (request, response) => {
    Models.favbooks.update(
      {
        dislike: 'true',
        like: 'false',
      },
      { where: { bookId: request.params.id } },
    ).then((rowObject) => {
      if (rowObject[0] === 1) { response({ statusCode: 201 }); } else {
        response({ statusCode: 400 });
      }
    });
  },
},
{
  method: 'GET',
  path: '/books/getbooks',
  handler: (request, response) => {
    Models.books.findAll().then((allBooks) => {
      const booksArray = [];
      allBooks.forEach((book) => {
        booksArray.push({
          Author: book.Author,
          Name: book.Name,
          bookId: book.bookId,
          rating: book.rating,
        });
      });
      return booksArray;
      // console.log('inside GET :', notes);
      // response(JSON.stringify(notes));
    }).then((booksArray) => {
      Models.likesArray.findAll().then((allLikes) => {
        const likesArray = [];
        allLikes.forEach((like) => {
          likesArray.push({
            bookId: like.bookId,
            like: like.like,
            dislike: like.dislike,
          });
        });
        const result = { booksArray, likesArray };
        response(result);
      });
    });
  },
},
];

module.exports = { routes, groupbyAuthor };
