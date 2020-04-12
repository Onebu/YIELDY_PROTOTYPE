const express = require("express");
const router = express.Router();
//JWT auth method
const checkAuth = require("../middleware/check-auth");

//imports from controller
const GroupsController =require( "../controllers/groups");

//Checked
//Get user's participated group
router.get('/mine/',checkAuth,GroupsController.group_get_group_me);
//Post a group
router.post('/',checkAuth,GroupsController.group_post_group);
//Unchecked
//Get all groups
router.get('/',GroupsController.group_get_all);
//Get comment by groupId
router.get('/:groupId',GroupsController.group_get_group_by_id);
//Delete a group
router.delete('/:groupId',checkAuth,GroupsController.group_delete_group);
//Get group's server list 
router.get('/:groupId/servers',checkAuth,GroupsController.group_get_group_server);
//Get group participants
router.get('/:groupId/participants',checkAuth,GroupsController.group_get_group_participants);
//Patch add member
router.patch('/add/:groupId',checkAuth,GroupsController.group_add_member);
//Patch remove member
router.patch('/remove/:groupId',checkAuth,GroupsController.group_remove_member);
//Patch group
router.patch('/:groupId',checkAuth,GroupsController.group_patch_group);


module.exports = router;