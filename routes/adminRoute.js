const express = require('express');
const router = express.Router();
const onlyAdminAccess = require('../middleware/adminAccessMiddleware');
const { addPermissionValidator,deletePermissionValidator,updatePermissionValidator } = require('../helpers/admin/adminValidator');
const adminController = require('../controllers/admin/permissionController');
const tokenVerification = require('../middleware/auth');

// only accessible to admin 
// admin routes
router.post('/add-permission',tokenVerification,onlyAdminAccess,addPermissionValidator,adminController.addPermission);
router.get('/get-permission',tokenVerification,onlyAdminAccess,adminController.getPermission);
router.delete('/delete-permission/:id',tokenVerification,onlyAdminAccess,deletePermissionValidator,adminController.deletePermission);
router.post('/update-permission/:id',tokenVerification,onlyAdminAccess,updatePermissionValidator,adminController.updatePermission);

module.exports = router;