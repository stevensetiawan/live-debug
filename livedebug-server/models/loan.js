'use strict';
module.exports = (sequelize, DataTypes) => {
  let models = sequelize.Sequelize.Model
  class Loan extends models{

  }
  Loan.init({
    MemberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'MemberId is required'
        },
        notNull: {
          args: true,
          msg: 'MemberId is required'
        }
      }
    },
    BookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'BookId is required'
        },
        notNull: {
          args: true,
          msg: 'BookId is required'
        }
      }
    },
    date_loaned: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Date loaned is required'
        },
        notNull: {
          args: true,
          msg: 'Date loaned is required'
        }
      }
    },
    date_returned: DataTypes.DATE
  }, {sequelize})
  // const Loan = sequelize.define('Loan', );
  Loan.associate = function(models) {
    Loan.belongsTo(models.Member)
    Loan.belongsTo(models.Book)
  };
  return Loan
};