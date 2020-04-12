const express = require("express");
const router = express.Router();
//import JWT auth method
const checkAuth = require("../middleware/check-auth")
//imports from controller
const CommentsController =require( "../controllers/comments");

//Get all comments in the collection
router.get('/',CommentsController.comment_get_all);
//Get all messagees with current logged user (User's comments&System messages from user's participated groups )
router.get('/related',checkAuth,CommentsController.comment_get_comment_related);
//Get user's comment(Published by user)
router.get('/mine',checkAuth,CommentsController.comment_get_comment_me);
//Search comment by optionals queries {body}
router.get('/search/:content',checkAuth,CommentsController.comment_get_comment_by_content);
//Get comment by commentid
router.get('/:commentId',CommentsController.comment_get_comment_by_id);
//Get all comments by the provided groupid
router.get('/group/:groupId', CommentsController.comment_get_comment_by_group);
//Post a comment(Must provide a valid access token)
router.post('/',checkAuth,CommentsController.comment_post_comment);


module.exports = router;