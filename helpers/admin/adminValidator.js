const {check,param, body }=  require('express-validator');

exports.addPermissionValidator=[
    check('permission_name','Permission name is Required').not().isEmpty()
];

exports.deletePermissionValidator=[
    param('id').notEmpty().withMessage('Permission id is required')
];
exports.updatePermissionValidator=[
    param('id').notEmpty().withMessage('Permission id is required'),
    body('updatePermissionName').notEmpty().withMessage('update Permission is required'),
    body('isDefault').optional()
]