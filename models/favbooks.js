'use strict';
module.exports = (sequelize, DataTypes) => {
  var favbooks = sequelize.define('favbooks', {
    like: DataTypes.STRING,
    dislike: DataTypes.STRING,
    bookId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return favbooks;
};