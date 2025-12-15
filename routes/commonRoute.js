const express = require('express');
const router = express();
const tokenVerification = require('../middleware/auth');
const commonController = require('../controllers/commonController');
const { addCategoryValidator, deleteCategoryValidator, updateCategoryValidator ,addPostValidator,deletePostValidator,updatePostValidator} = require('../helpers/commonValidator');

// category Route
router.post('/add-category', tokenVerification, addCategoryValidator, commonController.addCategory);
router.get('/get-category', tokenVerification, commonController.getAllCategory);
router.post('/delete-category/:id', tokenVerification, deleteCategoryValidator, commonController.deleteCategory);
router.post('/update-category/:id', tokenVerification, updateCategoryValidator, commonController.updateCategory);


// post Route
router.post('/add-post', tokenVerification, addPostValidator, commonController.addPost);
router.get('/get-post',tokenVerification,commonController.getAllpost);
router.post('/delete-post/:id',tokenVerification,deletePostValidator,commonController.deletePost);
router.post('/update-post/:id',tokenVerification,updatePostValidator,commonController.updatePost);


module.exports = router;
