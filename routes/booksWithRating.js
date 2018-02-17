const rp = require('request-promise');

let allBooks = [];
function groupbyAuthor(array) {
  const obj = {};
  for (let i = 0; i < array.length; i += 1) {
    // console.log("key is:",key);
    if (obj[array[i].Author] === undefined) {
      obj[array[i].Author] = [].concat(array[i]);
    } else {
      // arr = obj[array[i]['Author']];
      obj[array[i].Author] = obj[array[i].Author].concat(array[i]);
    }
  }
  return obj;
}
const getBooksPromise = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks').then((data) => {
  let books = {};
  books = JSON.parse(data);
  return books;
});

const getAllRating = (bookArray) => {
  const promiseArray = [];
  for (let i = 0; i < bookArray.books.length; i += 1) {
    const bookId = bookArray.books[i].id;
    // console.log('bookId:', bookId);
    promiseArray[i] = rp(`https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${bookId}`);
  }
  const booksAndPromise = {
    books: bookArray.books,
    promiseArray,
  };
  return booksAndPromise;
};

const booksWithRating = (booksAndPromise) => {
  Promise.all(booksAndPromise.promiseArray).then((ratingArray) => {
    for (let i = 0; i < booksAndPromise.books.length; i += 1) {
      booksAndPromise.books[i].rating = JSON.parse(ratingArray[i]).rating;
    }
    return (booksAndPromise.books);
  });
  allBooks = booksAndPromise.books;
  return (booksAndPromise.books);
};

const routes = [{
  method: 'GET',
  path: '/books',
  handler: (request, response) => {
    getBooksPromise.then(getAllRating).then(booksWithRating).then((booksArray) => {
      response(groupbyAuthor(booksArray));
    });
  },
},
];

module.exports = routes;
