const { validationResult } = require('express-validator');
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const addCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }

        const { category_name } = req.body;

        const isCategoryExist = await Category.findOne({
            name: {
                $regex: category_name,
                $options: 'i'
            }
        })

        if (isCategoryExist) {
            return res.status(400).json({
                status: false,
                msg: "category_name is already exist"
            })
        }

        const finalCategoryObj = new Category({
            name: category_name
        })

        const finalCategoryData = await finalCategoryObj.save();

        return res.status(201).json({
            status: true,
            msg: "category_name is created",
            data: finalCategoryData
        })



    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({});
        if (allCategory.length === 0) {
            return res.status(400).json({
                status: false,
                msg: "No record found"
            })
        }

        return res.status(200).json({
            status: true,
            msg: "Category record Fetch",
            data: allCategory
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }

        const { id } = req.params;
        const categoryforDelete = await Category.findByIdAndDelete(id);
        if (!categoryforDelete) {
            return res.status(400).json({
                status: false,
                msg: "No record founds"
            })
        }

        return res.status(400).json({
            status: true,
            msg: "Category deleted",
            data: categoryforDelete
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }

}

const updateCategory = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }

        const { id } = req.params;
        const { u_category_name } = req.body;

        const isCategoryExist = await Category.findById(id);
        if (!isCategoryExist) {
            return res.status(400).json({
                status: false,
                msg: "No record found"
            })
        }


        // checking for dupliate name

        const isCategoryNameExist = await Category.findOne({
            _id: { $ne: id },
            name: { $regex: `${u_category_name}`, $options: "i" }
        })

        if (isCategoryNameExist) {
            return res.status(400).json({
                status: false,
                msg: "Category name is already exist"
            })
        }

        const updatedCategory = await Category.findByIdAndUpdate({ _id: id },
            { $set: { name: u_category_name } },
            { new: true }
        );

        return res.status(200).json({
            status: true,
            msg: "Category updated !!",
            data: updatedCategory
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }

}

const addPost = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }

        const { title, description } = req.body;
        const newObj = {
            title,
            description
        }

        if (req.body.categories) {
            newObj.categories = req.body.categories;
        }



        const postData = new Post(newObj);
        const uPostData = await postData.save();

        const newData = await Post.findById(uPostData.id)
            .populate('categories', "name");

        return res.status(201).json({
            status: true,
            msg: "Post is created successfully",
            data: newData
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }

}

// get all posts

const getAllpost = async (req, res) => {
    try {
        const postData = await Post.find().populate("categories", "name");
        if (postData.length === 0) {
            return res.status(404).json({
                status: false,
                msg: "No record found"
            })
        }

        return res.status(200).json({
            status: true,
            msg: "Data fetch successfully",
            data: postData
        })
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }

}

const deletePost = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }

        const { id } = req.params;
        const postData = await Post.findByIdAndDelete(id);
        if (!postData) {
            return res.status(404).json({
                status: false,
                msg: "No record founds"
            })
        }

        return res.status(200).json({
            status: true,
            msg: "File Delete successfully",
            data: postData
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                msg: errors.array()
            })
        }
        const { id } = req.params;
        const isPost = await Post.findById(id);
        if (!isPost) {
            return res.status(404).json({
                status: false,
                msg: "No record found"
            })
        }

        if (req.body.title !== undefined) {
            isPost.title = req.body.title
        }
        if (req.body.description !== undefined) {
            isPost.description = req.body.description
        }
        if (req.body.categories !== undefined) {
            isPost.categories = req.body.categories
        }

         await isPost.save();
         await isPost.populate("categories","name");
        return res.status(200).json({
            status: true,
            msg: "Post updated successfully",
            data: isPost
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }
}

module.exports = {
    addCategory,
    getAllCategory,
    deleteCategory,
    updateCategory,
    addPost,
    getAllpost,
    deletePost,
    updatePost
}