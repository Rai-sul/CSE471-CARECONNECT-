import express from "express";
import {
  addChild,
  getMyChildren,
  deleteChild,
  updateChild, // 👈 এইটা মিসিং ছিল, তাই এরর আসছিল!
} from "../controllers/childController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addChild).get(protect, getMyChildren);

router.route("/:id").delete(protect, deleteChild).put(protect, updateChild); // এখন আর এরর দিবে না

export default router;
