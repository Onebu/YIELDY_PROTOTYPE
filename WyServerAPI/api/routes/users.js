const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth")


//Upload's settings
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname)
    }
});
const fileFilter = (req,file,cb )=> {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" ){
        cb(null,true);
    }else{
        cb(new Error("Not accepted type of file"),false);
    }
};
const upload = multer({
    storage:storage, 
    fileFilter : fileFilter,
    limits:{
    fileSize:1024*1025*5
    }
});
//imports from controller
const UsersController =require( "../controllers/users");

//Checked
//Handle incoming GET request to /users/me that allow user to fetch the profile data
router.get('/me',checkAuth,UsersController.users_get_me);
//Handle incoming signup request to /users/signup
router.post("/signup" , UsersController.sign_up);
//Handle incoming login request to /users/login
router.post("/login" ,UsersController.login);

//Handle incoming GET request to /users
router.get('/',UsersController.users_get_all);
//search user by name 
router.get('/search/:name',UsersController.user_search_by_name);
//Handle incoming GET request to /users/{userId}
router.get('/:userId',UsersController.users_get_by_id);
//Handle incoming PATCH request to /users/{userId}
router.patch("/:userId",checkAuth,upload.single("profileImage"),UsersController.users_patch);
//Handle incoming DELETE request to /users/{userId}
router.delete('/:userId',checkAuth,UsersController.users_delete);
//refresh token
router.post("/refresh",checkAuth,UsersController.refresh);

module.exports = router;