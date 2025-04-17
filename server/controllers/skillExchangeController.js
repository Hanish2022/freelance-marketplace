import { SkillExchange } from "../models/SkillExchange.js";
import User from "../models/User.js";

// Get all potential skill exchange matches
export const getSkillExchangeMatches = async (req, res) => {
  try {
    // Get all users except the current user
    const users = await User.find({ 
      _id: { $ne: req.user._id },
      isVerified: true 
    })
    .select('name email skills location profileImage bio');

    // Format the response
    const skillExchangers = users.map(user => ({
      _id: user._id,
      name: user.name,
      skills: user.skills || [],
      location: user.location || "Not specified",
      profileImage: user.profileImage,
      description: user.bio || "No description available",
    }));

    res.status(200).json({
      success: true,
      skillExchangers
    });
  } catch (error) {
    console.error("Error in getSkillExchangeMatches:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch skill exchangers",
      error: error.message 
    });
  }
};

// Create a new skill exchange request
export const createSkillExchange = async (req, res) => {
  const { partnerId, skill1, skill2 } = req.body;

  try {
    // Check if both users exist
    const user1 = req.user; // Current user
    const user2 = await User.findById(partnerId);

    if (!user2) {
      return res.status(404).json({ message: "Partner not found." });
    }

    // Create a new skill exchange
    const newSkillExchange = new SkillExchange({
      user1: user1._id,
      user2: user2._id,
      skill1,
      skill2,
      status: "Pending"
    });

    await newSkillExchange.save();
    res.status(201).json({
      success: true,
      message: "Skill exchange request created successfully",
      skillExchange: newSkillExchange
    });
  } catch (error) {
    console.error("Error in createSkillExchange:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create skill exchange request",
      error: error.message 
    });
  }
};

// Get all skill exchanges for a user
export const getUserSkillExchanges = async (req, res) => {
  try {
    const skillExchanges = await SkillExchange.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }],
    })
      .populate("user1", "name email")
      .populate("user2", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      skillExchanges
    });
  } catch (error) {
    console.error("Error in getUserSkillExchanges:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch skill exchanges",
      error: error.message 
    });
  }
};

// Update the status of a skill exchange
export const updateSkillExchangeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const skillExchange = await SkillExchange.findById(id);

    if (!skillExchange) {
      return res.status(404).json({ message: "Skill exchange not found." });
    }

    skillExchange.status = status;
    await skillExchange.save();

    res.status(200).json(skillExchange);
  } catch (error) {
    console.error("Error in updateSkillExchangeStatus:", error);
    res
      .status(500)
      .json({ message: "Server error. Please try again later.", error });
  }
};

// Delete a skill exchange
export const deleteSkillExchange = async (req, res) => {
  const { id } = req.params;

  try {
    const skillExchange = await SkillExchange.findByIdAndDelete(id);

    if (!skillExchange) {
      return res.status(404).json({ message: "Skill exchange not found." });
    }

    res.status(200).json({ message: "Skill exchange deleted successfully." });
  } catch (error) {
    console.error("Error in deleteSkillExchange:", error);
    res
      .status(500)
      .json({ message: "Server error. Please try again later.", error });
  }
};
