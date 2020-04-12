const Server = require("../models/server");
const Group = require("../models/group");
const Comment = require("../models/comment");
const User = require("../models/user");
const mongoose = require("mongoose");

//Mongoosastic sync& index mongodb to elasticsearch
Server.createMapping(function (err, mapping) {
    if (err) {
        console.log("err creating mapping");
        console.log(err);
    } else {
        console.log("Server Mapping created");
    }
});
//Synchronize mongodb data to elasticsearch
const stream = Server.synchronize();
var count = 0;
stream.on("data", function () {
    count++;
});
stream.on("close", function () {
    console.log("Indexed " + count + " docs in servers collection");
});
stream.on("error", function (err) {
    console.log(err);
});

//Get all the server stored in db
exports.server_get_all = (req, res, next) => {
    Server.find()
        .select("Name host type _id")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    servers: docs.map(doc => {
                        return {
                            name: doc.name,
                            host: doc.host,
                            type: doc.type,
                            _id: doc._id
                        }
                    })

                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entry found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
//Post a server to databae
exports.server_post = (req, res, next) => {
    server = new Server({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        ipv4: req.body.ipv4,
        ipv6: req.body.ipv6,
        name: req.body.name,
        host: req.body.host,
        location: req.body.location,
        uptime: req.body.uptime,
        load: req.body.load,
        downloads: req.body.downloads,
        uploads: req.body.uploads,
        cpu: req.body.cpu,
        ram: req.body.ram,
        hdd: req.body.hdd,
        group: req.body.group
    });
    server
        .save()
        .then(result => {
            if (result.name) {
                const comment = new Comment({
                    _id: mongoose.Types.ObjectId(),
                    publisher: req.userData.userId,
                    group: req.body.group,
                    replyto: req.body.replyto,
                    dataAdded: new Date(),
                    body: "The owner of group added a new server:" + result.name,
                    type: "system"
                });
                comment.save();

                Group.findOneAndUpdate({ _id: req.body.group }, {
                    $push: { servers: result._id }
                }, { new: true }).exec()
                    .then()
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
            res.status(201).json({
                message: "Created server successfully",
                createdServer: {
                    name: result.name,
                    type: result.type,
                    host: result.host
                }
            });
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
    server.on('es-indexed', function (err, res) {
        if (err) throw err;
        else console.log("Doc indexed");
    });
};
//Get server by id
exports.server_get_by_id = (req, res, next) => {
    const id = req.params.serverId;
    Server.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
    res.state
};

exports.server_get_server_me = (req, res, next) => {
    
    console.log(req.userData.userId);
    User.findById(req.userData.userId, function (error, user) {
        Server.find({
            group: { $in: user.groups }
        }).exec()
            .then(docs => {
                if (docs) {
                    res.status(200).json(docs);
                } else {
                    res.status(404).json({
                        message: "No valid entry found for provided ID"
                    });
                }
            })
            .catch(err => {
                console.log(err),
                    res.status(500).json({
                        error: err
                    });
            });
        if (error) {
            res.status(500).json({
                error: err
            });
        }
    });
}
//Delete a server in db by its id
exports.server_delete = (req, res, next) => {
    const id = req.params.serverId;

    Server.findById(id, function (error, server) {
        server.remove(function (err) {
            if (err) {
                res.status(500).json({
                    error: err
                });
            }
            else {
                res.status(200).json({
                    message: "Server deleted"
                });
            }
        });
    });
};