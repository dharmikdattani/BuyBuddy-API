const Validator = require("validatorjs");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category/category");
const SubCategory = require("../models/category/subCategory");
const { productSchema, categorySchema, subCategorySchema } = require("../schema/productSchema");

// Create prdoduct
const createProduct = async (req, res) => {
  try {

    const { error, value } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, content, price, quantity, category, subCategory } = value;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const newProduct = new Product({ title, content, images, price, quantity, category, subCategory });
    await newProduct.save();

    res.status(200).json({ success: true, message: "Product created successfully", data: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);

    if (err.message.includes('Validation error')) {
      return res.status(400).json({ message: JSON.parse(err.message) });
    }


    res.status(403).json({ message: 'Forbidden: You do not have permission to create this product.' });
  }
};


// Update product
const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { error, value } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, content, price, quantity, category, subCategory } = value;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.set({ title, content, price, quantity, category, subCategory });

    if (images.length) {
      product.images = images;
    }

    const updatedProduct = await product.save();
    res.json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: JSON.parse(err.message) });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { deleted: true });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err.message, err.stack);
    res.status(500).json({ success: false, message: "Error deleting product." });
  }
};

// Get product by ID
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = await Product.findOne({ _id: id, deleted: false });

    if (!product || product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product fetched Successfully", data: product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const skip = (page - 1) * limit;
  try {
    const products = await Product.find({ deleted: false }, null, { skip, limit });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        current_pages: page,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_previous: page > 1,
      },
    });

  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    console.log("Inside createCategory")
    const { error, value } = categorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { name } = value;

    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, message: "Category created successfully", savedCategory });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: JSON.parse(err.message) });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    console.log("Here")
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }
    res.status(200).json({ success: true, message: "Categories fetched successfully", data: categories });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
};

// Create subcategory
const subCategory = async (req, res) => {
  try {

    const { error, value } = subCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, category } = value;

    const record = await Category.findById(category);

    if (!record) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const newSubCategory = new SubCategory({ name, category });
    const savedSubCategory = await newSubCategory.save();

    res.status(201).json({ success: true, message: "Sub-category created successfully", savedSubCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: JSON.parse(err.message) });
  }
};

// Get all subcategories
const getAllSubCategories = async (req, res) => {
  try {

    const record = await SubCategory.find();

    if (!record || record.length === 0) {
      return res.status(404).json({ message: "No record found" });
    }

    res.status(200).json({ success: true, message: "Sub-categories fetched Successfully", data: record });

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching sub-categories" });
  }
};

module.exports = {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  subCategory,
  getAllCategories,
  getAllSubCategories
};
