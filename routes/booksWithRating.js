const rp = require('request-promise');

function groupbyAuthor(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    // console.log("key is:",key);
    if (obj[array[i].Author] === undefined) {
      obj[array[i].Author] = [].concat(array[i]);
    } else {
      // arr = obj[array[i]['Author']];
      obj[array[i].Author] = obj[array[i].Author].concat(array[i]);
    }
  }
  console.log(obj);
  return obj;
}
let booksCombined = {};
module.exports = {
  method: 'GET',
  path: '/books',
  handler: (request, response) => {
    rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks').then((data) => {
      let books = {};
      books = JSON.parse(data);
      return books;
    }).then((bookArray) => {
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
    }).then((booksAndPromise) => {
      Promise.all(booksAndPromise.promiseArray).then((ratingArray) => {
        // console.log('ratingArray:', ratingArray);
        for (let i = 0; i < booksAndPromise.books.length; i += 1) {
          booksAndPromise.books[i].rating = JSON.parse(ratingArray[i]).rating;
        }
        return (booksAndPromise.books);
      }).then((booksArray) => {
        booksCombined = groupbyAuthor(booksArray);
        response(booksCombined);
      });
    });
  },
};

