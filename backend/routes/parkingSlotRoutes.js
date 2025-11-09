const express = require("express");
const router = express.Router();
const {
  getAll,
  createData,
  getDataById,
  editData,
  deleteData,
  getSlotsByLot
} = require("../controllers/parkingSlotController");
const { verifyToken, requireAdmin } = require("../middlewares/auth");

router.get("/", verifyToken, getAll);
router.post("/", verifyToken, requireAdmin, createData);
router.get("/:id", verifyToken, getDataById);
router.put("/:id", verifyToken, requireAdmin, editData);
router.delete("/:id", verifyToken, requireAdmin, deleteData);
router.get("/lot/:lotId", verifyToken, getSlotsByLot);

module.exports = router;
