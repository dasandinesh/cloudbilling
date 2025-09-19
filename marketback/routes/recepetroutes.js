const express = require("express");
const router = express.Router();
const {
  getAllReceipts,
  createReceipt,
  getReceiptById,
  deleteReceipt,
  updateReceipt,
} = require("../controller/receipetcontroller");

router.route("/").get(getAllReceipts).post(createReceipt);
router.route("/:id").get(getReceiptById).put(updateReceipt).delete(deleteReceipt);

module.exports = router;
