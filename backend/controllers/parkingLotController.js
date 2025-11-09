const parkingLotModel = require("../models/parkingLotModel");
const parkingSlotModel = require("../models/parkingSlotModel");
const { responseDefault } = require("../utils/responseMessage");

const getAll = async (req, res) => {
  try {
    const data = await parkingLotModel.find();
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
    const { name, location, total_slots } = req.body;
    const data = await parkingLotModel.create({
      name,
      location,
      total_slots,
      available_slots: total_slots // Initially all slots are available
    });

    // Create parking slots for the new lot
    const slots = [];
    for (let i = 1; i <= total_slots; i++) {
      slots.push({
        lot_id: data._id,
        slot_number: i,
        status: 'AVAILABLE'
      });
    }
    await parkingSlotModel.insertMany(slots);

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
    const data = await parkingLotModel.findById(id);
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
    const data = await parkingLotModel.findByIdAndUpdate(id, updateData, {
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
    const data = await parkingLotModel.findByIdAndDelete(id);
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

const getStatistics = async (req, res) => {
  try {
    const lots = await parkingLotModel.find();
    const stats = await Promise.all(lots.map(async (lot) => {
      const slots = await parkingSlotModel.find({ lot_id: lot._id });
      const available = slots.filter(slot => slot.status === 'AVAILABLE').length;
      const occupied = slots.filter(slot => slot.status === 'OCCUPIED').length;
      const reserved = slots.filter(slot => slot.status === 'RESERVED').length;
      return {
        lotName: lot.name,
        totalSlots: lot.total_slots,
        available,
        occupied,
        reserved,
        occupancyPercentage: ((occupied + reserved) / lot.total_slots * 100).toFixed(2)
      };
    }));
    const totalAvailable = stats.reduce((sum, stat) => sum + stat.available, 0);
    const totalOccupied = stats.reduce((sum, stat) => sum + stat.occupied, 0);
    const totalReserved = stats.reduce((sum, stat) => sum + stat.reserved, 0);
    const totalSlots = stats.reduce((sum, stat) => sum + stat.totalSlots, 0);
    const overallOccupancy = totalSlots > 0 ? ((totalOccupied + totalReserved) / totalSlots * 100).toFixed(2) : 0;
    res.status(200).json({
      success: true,
      data: {
        perLot: stats,
        overall: {
          totalSlots,
          available: totalAvailable,
          occupied: totalOccupied,
          reserved: totalReserved,
          occupancyPercentage: overallOccupancy
        }
      },
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

module.exports = { getAll, createData, getDataById, editData, deleteData, getStatistics };
