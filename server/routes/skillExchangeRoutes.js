import express from "express";
import {
  createSkillExchange,
  getUserSkillExchanges,
  updateSkillExchangeStatus,
  deleteSkillExchange,
  getSkillExchangeMatches
} from "../controllers/skillExchangeController.js";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();

// Get all potential skill exchange matches
router.get("/matches", isAuthenticated, getSkillExchangeMatches);

// Create a new skill exchange
router.post("/", isAuthenticated, createSkillExchange);

// Get all skill exchanges for the authenticated user
router.get("/user", isAuthenticated, getUserSkillExchanges);

// Update the status of a skill exchange
router.put("/:id", isAuthenticated, updateSkillExchangeStatus);

// Delete a skill exchange
router.delete("/:id", isAuthenticated, deleteSkillExchange);

export default router;
