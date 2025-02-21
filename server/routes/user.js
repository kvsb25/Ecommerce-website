const express = require("express");
const router = express.Router();
const customerRouter = require("./customer.js");
const vendorRouter = require("./vendor.js");

router.use('/', customerRouter);
router.use('/', vendorRouter);

module.exports = router;