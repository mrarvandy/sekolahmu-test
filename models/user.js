'use strict';

const {generatePassword} = require('../helpers/bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must be filled'
        },
        len: {
          args: [8],
          msg: 'Minimum password length is 8 chars'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must be filled'
        },
        len: {
          args: [8],
          msg: 'Minimum password length is 8 chars'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must be filled'
        },
        isIn: {
          args: [['Admin', 'Teacher', 'Student']],
          msg: 'Must be appropriate role: Admin/Teacher/Student'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must be filled'
        },
        len: {
          args: [8],
          msg: 'Minimum password length is 8 chars'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    user.password = generatePassword(user.password)
  })
  User.beforeUpdate((user, options) => {
    user.password = generatePassword(user.password)
  })

  return User;
};