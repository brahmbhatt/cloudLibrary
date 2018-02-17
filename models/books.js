

module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    Author: DataTypes.STRING,
    Name: DataTypes.STRING,
    bookId: DataTypes.STRING,
    rating: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return books;
};
