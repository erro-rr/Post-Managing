const express = require('express');
const router = express.Router();
const { addPermissionValidator,deletePermissionValidator,updatePermissionValidator } = require('../helpers/admin/adminValidator');
const adminController = require('../controllers/admin/permissionController');
const tokenVerification = require('../middleware/auth');

router.post('/add-permission',tokenVerification,addPermissionValidator,adminController.addPermission);
router.get('/get-permission',tokenVerification,adminController.getPermission);
router.delete('/delete-permission/:id',tokenVerification,deletePermissionValidator,adminController.deletePermission);
router.post('/update-permission/:id',tokenVerification,updatePermissionValidator,adminController.updatePermission);

module.exports = router;