const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const upload = require("../config/multerConfig");
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    singleProduct,
    createCategory,
    subCategory,
    getAllCategories,
    getAllSubCategories
} = require("../controller/productController");

// Product routes
router.post("/add", authenticateToken, upload.array("images"), createProduct);
router.get("/get", authenticateToken, getAllProducts);
router.post("/category/add", authenticateToken, createCategory);
router.post("/subcategory/add", authenticateToken, subCategory);
router.get("/get/category", authenticateToken, getAllCategories);
router.get("/get/sub-category", authenticateToken, getAllSubCategories);
router.put("/update/:id", authenticateToken, upload.array("images"), updateProduct);
router.delete("/remove/:id", authenticateToken, deleteProduct);
router.get("/get/:id", authenticateToken, singleProduct);




module.exports = router;



