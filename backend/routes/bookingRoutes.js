const express = require("express");
const router = express.Router();
const {
  getAll,
  createData,
  getDataById,
  editData,
  deleteData,
  bookSlot,
  checkin,
  checkout
} = require("../controllers/bookingController");
const { verifyToken, requireAdmin } = require("../middlewares/auth");

router.get("/", verifyToken, getAll);
router.post("/", verifyToken, requireAdmin, createData);
router.get("/:id", verifyToken, getDataById);
router.put("/:id", verifyToken, requireAdmin, editData);
router.delete("/:id", verifyToken, requireAdmin, deleteData);
router.post("/book", verifyToken, bookSlot);
router.put("/checkin/:id", verifyToken, checkin);
router.put("/checkout/:id", verifyToken, checkout);

module.exports = router;
