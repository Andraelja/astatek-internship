const bookingModel = require("../models/bookingModel");
const { responseDefault } = require("../utils/responseMessage");

const getAll = async (req, res) => {
  try {
    const data = await bookingModel.find();
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
    const data = await bookingModel.findById(id);
    res.status(201).json({
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
    res.status(201).json({
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

module.exports = { getAll, createData, getDataById, editData, deleteData };
