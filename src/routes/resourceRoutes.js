const express = require("express");
const {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resource.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, createResource);
router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.put("/:id", authMiddleware, updateResource);
router.delete("/:id", authMiddleware, deleteResource);

module.exports = router;
