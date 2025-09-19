const Receipt = require("../model/receipetmodel");

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Public
const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ date: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// @desc    Add a new receipt
// @route   POST /api/receipts
// @access  Public
const createReceipt = async (req, res) => {
  const { customerName, date, amount, description, category, payMethod } = req.body;

  if (!customerName || !date || !amount || !description || !category || !payMethod) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const receipt = new Receipt({
      customerName,
      date,
      amount,
      description,
      category,
      payMethod,
    });

    const savedReceipt = await receipt.save();
    res.status(201).json(savedReceipt);
  } catch (error) {
    res.status(500).json({ message: "Failed to add receipt: " + error.message });
  }
};

// @desc    Get a single receipt by ID
// @route   GET /api/receipts/:id
// @access  Public
const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Error fetching receipt: " + error.message });
  }
};

// @desc    Delete a receipt
// @route   DELETE /api/receipts/:id
// @access  Public
const deleteReceipt = async (req, res) => {
  try {
    const deleted = await Receipt.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting receipt: " + error.message });
  }
};

// @desc    Update a receipt
// @route   PUT /api/receipts/:id
// @access  Public
const updateReceipt = async (req, res) => {
  try {
    const updatedReceipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json(updatedReceipt);
  } catch (error) {
    res.status(500).json({ message: "Error updating receipt: " + error.message });
  }
};

module.exports = {
  getAllReceipts,
  createReceipt,
  getReceiptById,
  deleteReceipt,
  updateReceipt,
};
