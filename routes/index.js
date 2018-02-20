const ping = require('./ping');
const { routes } = require('./booksWithRating');

module.exports = [].concat(ping, routes);
