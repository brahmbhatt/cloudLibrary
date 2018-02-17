const ping = require('./ping');
const books = require('./booksWithRating');

module.exports = [].concat(ping, books);
