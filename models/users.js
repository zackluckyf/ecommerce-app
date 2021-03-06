'use strict';

var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    firstName: {
      field: 'first_name', 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'First name can only contain alphabetic characters'
        },
        notEmpty: true
      }
    },
    lastName: {
      field: 'last_name', 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Last name can only contain alphabetic characters'
        },
        notEmpty: true
      }
    },
    birthday: {
      field: 'birth_date', 
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: {
          args: moment(new Date()).format('YYYY-MM-DD'),
          msg: 'Birthday cannot be in the future'
        }
      }
    },
    resetPasswordToken: {
      field: 'reset_password_token', 
      type: DataTypes.STRING
    },
    resetPasswordExpires: {
      field: 'reset_password_expires', 
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email already registered'
      },
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Username already in use'
      },
      allowNull: false,
      validate: {
        isAlphanumeric: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        users.hasMany(models.posts);
        users.hasMany(models.comments);
      }
    },
    timestamps:false
  });
  return users;
};