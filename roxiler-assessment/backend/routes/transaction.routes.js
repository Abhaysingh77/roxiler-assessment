const router = require("express").Router();
const { getAll, getTransactionByMonth } = require("../controllers/transaction.controllers")
router.get("/", getAll);
router.get("/:month", getTransactionByMonth);

module.exports = router