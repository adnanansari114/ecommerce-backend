const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../middleware/adminMiddleware");
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");
router.get("/", getCategories);
router.post("/", adminMiddleware, addCategory);
router.put("/:id", adminMiddleware, updateCategory);
router.delete("/:id", adminMiddleware, deleteCategory);

module.exports = router;
