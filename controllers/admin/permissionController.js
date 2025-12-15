const Permission = require('../../models/permissionModel');
const { validationResult } = require('express-validator');
const addPermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: "Erorr",
                Error: errors.array()
            })
        }

        const { permission_name } = req.body;
        const isPermissionNameExist = await Permission.findOne({ permission_name });
        if (isPermissionNameExist) {
            return res.status(400).json({
                status: false,
                msg: "Permission name is already exist"
            })
        }
        const permissionData = new Permission({
            permission_name,
            isDefault: req.body.isDefault ? parseInt(req.body.isDefault) : 0
        })

        const newPermissionData = await permissionData.save();

        return res.status(201).json({
            status: true,
            msg: "Permission created Successfully !!",
            data: newPermissionData
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            msg: "Unable to add permission"
        })
    }

}

const getPermission = async (req, res) => {
    try {
        const allPermission = await Permission.find({});
        if (!allPermission) {
            return res.status(400).json({
                status: false,
                msg: "Unable to get records"
            })
        }
        if (allPermission.length === 0) {
            return res.status(200).json({
                status: true,
                msg: "No record Found"
            })
        }

        return res.status(200).json({
            status: true,
            data: allPermission
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            msg: "Unable to get Permission"
        })
    }
}

const deletePermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }
        const { id } = req.params;
        const permissionDlt = await Permission.findByIdAndDelete(id);
        if (!permissionDlt) {
            return res.status(404).json({
                status: false,
                msg: "No record found"
            })
        }

        return res.status(200).json({
            status: true,
            msg: "Permission Deleted Successfully",
            data: permissionDlt
        })

    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: "Unable to delete Permission"
        })
    }
}

const updatePermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }
        const { id } = req.params;
        const { updatePermissionName, isDefault } = req.body;
        // Check duplicate name for other records
        const isUpdatePermissionNameExist = await Permission.findOne({
            _id: { $ne: id },
            permission_name: { $regex: `${updatePermissionName}`, $options: "i" }
        }
        );
        if (isUpdatePermissionNameExist) {
            return res.status(400).json({
                status: false,
                msg: `${updatePermissionName} Permission name is already exist`
            })
        }

        const updatePayload = {};
        if (updatePermissionName) {
            updatePayload.permission_name = updatePermissionName
        }

        if (typeof isDefault !== "undefined") {
            updatePayload.isDefault = parseInt(isDefault);
        }

        const permissionData = await Permission.findByIdAndUpdate(
            id,
            updatePayload,
            { new: true }
        );
        if (!permissionData) {
            return res.status(404).json({
                status: false,
                msg: "Record is not found"
            })
        }

        return res.status(200).json({
            status: true,
            msg: "Permission data is updated",
            data: permissionData
        })


    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            msg: "Unable to update Permission"
        })
    }
}

module.exports = {
    addPermission,
    getPermission,
    deletePermission,
    updatePermission
}