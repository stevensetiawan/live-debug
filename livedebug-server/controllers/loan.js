const { Loan } = require('../models');

class LoanController {
  static create(req, res, next) {
    const { MemberId, BookId, date_loaned } = req.body;
    Loan.create({ MemberId, BookId, date_loaned })
      .then(function(newLoan) {
        res.status(201).json(newLoan);
      })
      .catch(next);
  }

  static find(req, res, next) {
    Loan.findAll()
      .then(function(loans) {
        res.status(200).json(loans);
      })
      .catch(next);
  }

  static returnALoan(req, res, next) {
    const { id } = req.params;
    Loan.findOne({ id })
      .then(function(loan) {
        if (!loan) {
          next({ code: 404, resource: 'Loan' });
        } else {
          loan.date_returned = new Date();
          loan.save().then(function() {
            res.status(200).json({
              message: 'Successfully returned'
            });
          });
        }
      })
      .catch(function(err) {
        if (err.name === 'CastError') next({ code: 404, resource: 'Loan' })
        else next(err)
      });
  }
}

module.exports = LoanController;
