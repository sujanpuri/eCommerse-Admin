// controllers/costumerController.js
import Costumer from "../models/Costumer.js";

// @desc    Create or find costumer
// @route   POST /api/costumers
// @access  Public (OAuth login)
export const createOrFindCostumer = async (req, res) => {
  try {
    const { name, email, image } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let costumer = await Costumer.findOne({ email });

    if (!costumer) {
      costumer = await Costumer.create({ name, email, image });
    }

    res.status(200).json(costumer);
  } catch (error) {
    console.error("CreateOrFindCostumer error:", error.message);
    res.status(500).json({ error: "Server error while creating/finding costumer" });
  }
};

// @desc    Get all costumers (admin use)
// @route   GET /api/costumers
// @access  Admin
export const getAllCostumers = async (req, res) => {
  try {
    const costumers = await Costumer.find();
    res.status(200).json(costumers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch costumers" });
  }
};

// @desc    Get costumer by ID
// @route   GET /api/costumers/:id
// @access  Private
export const getCostumerById = async (req, res) => {
  try {
    const costumer = await Costumer.findById(req.params.id);

    if (!costumer) {
      return res.status(404).json({ error: "Costumer not found" });
    }

    res.status(200).json(costumer);
  } catch (error) {
    res.status(500).json({ error: "Failed to get costumer" });
  }
};

// @desc    Update costumer profile
// @route   PUT /api/costumers/:id
// @access  Private (owner only)
export const updateCostumer = async (req, res) => {
  try {
    const costumer = await Costumer.findById(req.params.id);

    if (!costumer) {
      return res.status(404).json({ error: "Costumer not found" });
    }

    const { name, image, email } = req.body;

    // Verify: only allow if the email matches the owner's email
    if (costumer.email !== email) {
      return res.status(403).json({ error: "Unauthorized to update this account" });
    }


    if (name) costumer.name = name;
    if (image) costumer.image = image;

    const updatedCostumer = await costumer.save();

    res.status(200).json(updatedCostumer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update costumer" });
  }
};

// @desc    Delete costumer account
// @route   DELETE /api/costumers/:id
// @access  Private (owner only)
export const deleteCostumer = async (req, res) => {
  try {
    const costumer = await Costumer.findById(req.params.id);

    if (!costumer) {
      return res.status(404).json({ error: "Costumer not found" });
    }
    
    const { email } = req.body;

    // Verify: only allow if the email matches the owner's email
    if (costumer.email !== email) {
      return res.status(403).json({ error: "Unauthorized to update this account" });
    }

    await costumer.remove();
    res.status(200).json({ message: "Costumer account deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete costumer" });
  }
};
