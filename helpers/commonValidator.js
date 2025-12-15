const { check, param, body } = require('express-validator');

exports.addCategoryValidator = [
    check('category_name', 'category_name is required').not().isEmpty()
]

exports.deleteCategoryValidator = [
    param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('Invalid category id')
]

exports.updateCategoryValidator = [
    param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('Invalid mongo id'),
    body('u_category_name').notEmpty().withMessage('u_category_name is required')

]

exports.addPostValidator = [
    body('title').notEmpty().withMessage('title is required'),
    body('description').notEmpty().withMessage('description is required'),
    body('categories').optional()
]

exports.deletePostValidator=[
    param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('Invalid mongo id')
]

exports.updatePostValidator =[
    param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('Invalid mongo id'),
]