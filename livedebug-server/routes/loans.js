const express = require('express');
const router = express.Router();

const LoanController = require('../controllers/loan');

router.post('/loans', LoanController.create);
router.get('/loans', LoanController.find);
router.patch('/loans/:id', LoanController.returnALoan);

module.exports = router;
