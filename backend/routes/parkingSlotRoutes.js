const express = require("express");
const router = express.Router();
const {
  getAll,
  createData,
  getDataById,
  editData,
  deleteData
} = require("../controllers/parkingSlotController");

router.get("/", getAll);
router.post("/", createData);
router.get("/:id", getDataById);
router.put("/:id", editData);
router.delete("/:id", deleteData);

module.exports = router;
