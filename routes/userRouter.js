const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator, userLoginValidator, updateProfileValidator } = require('../helpers/validator');
const tokenVerification = require('../middleware/auth');


// Middleware
router.use(express.json());

// Use of Multer for user profile image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
            cb(null, path.join(__dirname, '../public/images'));
        }
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
})

// Filter for the image 
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
// Uploading image
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Router for User registration
router.post('/register', upload.single('image'), registerValidator, userController.userRegister);
router.post('/user-login', userLoginValidator, userController.userLogin);
// Authenticated Endpoints
router.get('/user-profile', tokenVerification, userController.getUserProfile);
router.post('/update-user-profile', tokenVerification, upload.single('image'), updateProfileValidator, userController.updateProfile);
router.get('/user-logout',tokenVerification,userController.userLogout);

module.exports = router;

