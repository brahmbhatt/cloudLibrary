const { groupbyAuthor } = require('../../routes/booksWithRating');
const { arr, result } = require('./object');

describe('the function groups books by author', () => {
  test('test case for given input', () => {
    expect(groupbyAuthor(arr)).toEqual(result);
  });

  test('test case for given input', () => {
    expect(groupbyAuthor([])).toEqual({});
  });
  test('test case for given input', () => {
    expect(groupbyAuthor([{ Author: 'Sidney Sheldon' }])).toEqual({ 'Sidney Sheldon': [{ Author: 'Sidney Sheldon' }] });
  });
});
