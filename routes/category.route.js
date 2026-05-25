const express = require("express");
const router = express.Router();

const {
    createCategory,
    uploadSingleImage,
    resizeImage,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoryById,
} = require("../controllers/category.controller");

const {
    createCategoryValidator,
    getCategoryValidator,
    deleteCategoryValidator,
    updateCategoryValidator,
} = require("../utils/validators/category.validator");

const protect = require("../middlewares/protect.middleware");
const subCategoryRoute = require("./subcategory.route");

router.use("/:categoryId/subcategories", subCategoryRoute);

router
    .route("/")
    .post(
        protect.auth,
        protect.allowedTo("admin", "manager"),
        uploadSingleImage,
        resizeImage,
        createCategoryValidator,
        createCategory,
    )
    .get(getCategories);
router
    .route("/:id")
    .get(getCategoryValidator, getCategoryById)
    .put(
        protect.auth,
        protect.allowedTo("admin", "manager"),
        uploadSingleImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory,
    )
    .delete(
        protect.auth,
        protect.allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory,
    );
module.exports = router;
