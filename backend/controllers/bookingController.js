const bookingModel = require("../models/bookingModel");
const parkingSlotModel = require("../models/parkingSlotModel");
const { responseDefault } = require("../utils/responseMessage");

const getAll = async (req, res) => {
  try {
    const user_id = req.userId;
    const userRole = req.userRole;

    let query = {};
    if (userRole !== 'admin') {
      query.user_id = user_id;
    }

    const data = await bookingModel.find(query).populate('user_id').populate('lot_id').populate('slot_id');
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
    const data = await bookingModel.create(req.body);
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
    const data = await bookingModel.findById(id).populate('user_id').populate('lot_id').populate('slot_id');
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
    const data = await bookingModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
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
    const data = await bookingModel.findByIdAndDelete(id);
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

const bookSlot = async (req, res) => {
  try {
    const { slot_id } = req.body;
    const user_id = req.userId;

    // Check if slot is available
    const slot = await parkingSlotModel.findById(slot_id);
    if (!slot || slot.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // Create booking
    const booking = await bookingModel.create({
      user_id,
      lot_id: slot.lot_id,
      slot_id,
      status: 'RESERVED'
    });

    // Update slot status
    await parkingSlotModel.findByIdAndUpdate(slot_id, { status: 'RESERVED' });

    res.status(201).json({
      success: true,
      message: 'Slot booked successfully',
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const checkin = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const booking = await bookingModel.findById(id);
    if (!booking || booking.user_id.toString() !== user_id || booking.status !== 'RESERVED') {
      return res.status(400).json({ message: 'Invalid booking' });
    }

    await bookingModel.findByIdAndUpdate(id, { status: 'OCCUPIED', checkin_time: new Date() });
    await parkingSlotModel.findByIdAndUpdate(booking.slot_id, { status: 'OCCUPIED' });

    res.status(200).json({
      success: true,
      message: 'Checked in successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

const checkout = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const booking = await bookingModel.findById(id);
    if (!booking || booking.user_id.toString() !== user_id || booking.status !== 'OCCUPIED') {
      return res.status(400).json({ message: 'Invalid booking' });
    }

    await bookingModel.findByIdAndUpdate(id, { status: 'COMPLETED', checkout_time: new Date() });
    await parkingSlotModel.findByIdAndUpdate(booking.slot_id, { status: 'AVAILABLE' });

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error,
    });
  }
};

module.exports = { getAll, createData, getDataById, editData, deleteData, bookSlot, checkin, checkout };
