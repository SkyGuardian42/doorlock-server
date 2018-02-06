'use strict';
module.exports = (sequelize, DataTypes) => {
  var Log = sequelize.define('Log', {
    user: DataTypes.STRING,
    action: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Log;
};