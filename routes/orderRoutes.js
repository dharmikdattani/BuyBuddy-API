const express = require('express');
const router = express.Router();

const { createOrder, userOrder, orderList } = require('../controller/orderContoller');
const authenticateToken = require('../middleware/auth');

router.get("/get/:id", userOrder)
router.get("/get", orderList)
router.post("/create", authenticateToken,createOrder)


module.exports = router;
