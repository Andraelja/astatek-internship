const parkingSlotModel = require("../models/parkingSlotModel");
const parkingLotModel = require("../models/parkingLotModel");
const { responseDefault } = require("../utils/responseMessage");

const getAll = async (req, res) => {
  try {
    const data = await parkingSlotModel.find();
    res.status(200).json({
      success: true,
      data: data,
      message: responseDefault.GET_DATA,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const createData = async (req, res) => {
  try {
    const data = await parkingSlotModel.create(req.body);
    // Update lot available_slots
    await updateLotAvailability(data.lot_id);
    res.status(201).json({
      success: true,
      message: responseDefault.CREATED_DATA,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await parkingSlotModel.findById(id);
    res.status(200).json({
      success: true,
      message: responseDefault.GET_DATA,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const editData = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await parkingSlotModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    // Update lot available_slots
    await updateLotAvailability(data.lot_id);
    res.status(200).json({
      success: true,
      message: responseDefault.EDIT_DATA,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await parkingSlotModel.findById(id);
    const data = await parkingSlotModel.findByIdAndDelete(id);
    // Update lot available_slots
    await updateLotAvailability(slot.lot_id);
    res.status(200).json({
      success: true,
      message: responseDefault.DELETE_DATA,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const getSlotsByLot = async (req, res) => {
  try {
    const { lotId } = req.params;
    const data = await parkingSlotModel.find({ lot_id: lotId });
    res.status(200).json({
      success: true,
      data: data,
      message: responseDefault.GET_DATA,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const updateLotAvailability = async (lotId) => {
  const slots = await parkingSlotModel.find({ lot_id: lotId });
  const availableCount = slots.filter(slot => slot.status === 'AVAILABLE').length;
  await parkingLotModel.findByIdAndUpdate(lotId, { available_slots: availableCount });
};

module.exports = { getAll, createData, getDataById, editData, deleteData, getSlotsByLot };
