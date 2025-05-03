const express = require('express');
const router = express.Router();

const {payment} = require('../controller/paymentController')



router.post("/payment", payment)


module.exports = router