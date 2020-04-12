const express = require("express");
const router = express.Router();
//JWT auth method
const checkAuth = require("../middleware/check-auth");

//imports from controller
const ServersController =require( "../controllers/servers");
//Handle incoming GET request to /servers
router.get("/", ServersController.server_get_all);

//Handle incoming POST request to /servers
router.post("/",checkAuth,ServersController.server_post);

//Get user's server
router.get("/me",checkAuth,ServersController.server_get_server_me);

//Handle incoming GET request to /servers/{serverId}
router.get("/:serverId",ServersController.server_get_by_id);

//Handle incoming DELETE request to /servers/{serverId}
router.delete("/:serverId",ServersController.server_delete);



module.exports = router;
