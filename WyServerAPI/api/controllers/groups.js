const Group = require("../models/group");
const User = require("../models/user");
const Server = require('../models/server');
const Comment = require("../models/comment");
const mongoose = require("mongoose");

//Mongoosastic sync& index mongodb to elasticsearch
Group.createMapping(function (err, mapping) {
    if (err) {
        console.log("err creating mapping");
        console.log(err);
    } else {
        console.log("group Mapping created");
    }
});
const stream = Group.synchronize();
var count = 0;
stream.on("data", function () {
    count++;
});
stream.on("close", function () {
    console.log("Indexed " + count + " docs in groups collection");
});
stream.on("error", function (err) {
    console.log(err);
});



//GET all group stored in database
exports.group_get_all = (req, res, next) => {

    Group.find()
        .populate('participants', 'nickname _id email')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

//Get group by id
exports.group_get_group_by_id = (req, res, next) => {

    const id = req.params.groupId;
    Group.findById(id)
        .populate('servers')
        .populate('participants', 'nickname _id email')
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
};

//Get group's participants by provided group id.
exports.group_get_group_participants = (req, res, next) => {

    const id = req.params.groupId;
    Group.findById(id)
        .populate('participants', 'nickname _id email')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc.participants);
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
};
//Get user's owned groups
exports.group_get_group_me = (req, res, next) => {

    Group.find({ participants: { $all: [req.userData.userId] } })
        .populate('servers')
        .populate('participants', 'nickname _id email')
        .exec()
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

};
//Create a  group (*With a valid access token)
exports.group_post_group = (req, res, next) => {
    group = new Group({
        _id: new mongoose.Types.ObjectId(),
        owner: req.userData.userId,
        participants: [req.userData.userId],
        servers: req.body.servers,
        admins: req.body.admins,
        name: req.body.name,
        dataCreated: new Date(),
    });
    group.save()
        .then(result => {
            var id = result._id;
            User.findOneAndUpdate({ _id: req.userData.userId }, {
                $push: { groups: id }
            }, { new: true }).exec()
                .then()
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });

    //update index to elasticsearch
    group.on('es-indexed', function (err, res) {
        if (err) throw err;
        else console.log("Doc indexed");
    });
}

//Delete group by its id  (************)
exports.group_delete_group = (req, res, next) => {
    const id = req.params.groupId;
    Group.findById(id, function (error, group) {
        if (group.owner == req.userData.userId) {
            group.remove(function (err) {
                //TODO :  remove referenced comments and delete groupID from it's members group list. *&Servers of group 
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                }
                else {
                    User.updateMany({ _id: { $in: group.participants } }, {
                        $pull: { groups: id }
                    }, { new: true }).exec()
                        .then()
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                    Server.deleteMany({ _id: { $in: group.servers } })
                        .exec()
                        .then()
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                    res.status(200).json({
                        message: "Group deleted"
                    });
                }
            });
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID"
            });
        }
    });
}

//Patch(Update) an existing group in databse
exports.group_patch_group = (req, res, next) => {

    const id = req.params.groupId;
    userId = req.userData.userId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Group.findOneAndUpdate({ _id: id, owner: userId }, {
        $set:
            updateOps
    }, { new: true }).exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "updated"
                });
            } else {
                res.status(404).json({
                    message: "No valid content"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // Update to elasticsearch 
    Group.on('es-indexed', function (err, res) {
        if (err) throw err;
        else console.log("Doc indexed");
    });
};

exports.group_add_member = (req, res, next) => {

    const id = req.params.groupId;
    userId = req.userData.userId
    Group.findOneAndUpdate({ _id: id, owner: userId }, {
        $addToSet: { participants: req.body.id }
    }, { new: true }).exec()
        .then(result => {
            if (result) {
                User.findOneAndUpdate({
                    _id: req.body.id,
                    groups: {
                        $nin: [id]
                    }

                }, {
                    $addToSet: { groups: id },
                }, {
                    new: true
                }, (err, doc) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    }
                    if(doc){
                        const comment = new Comment({
                            _id: mongoose.Types.ObjectId(),
                            publisher: req.userData.userId,
                            group: id,
                            replyto: req.body.replyto,
                            dataAdded: new Date(),
                            body: "A new member was added by group owner",
                            type: "system"
                        });
                        comment.save();
                    }
                });
                res.status(200).json({
                    message: "updated"
                });
            } else {
                res.status(404).json({
                    message: "No valid content"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};

exports.group_remove_member = (req, res, next) => {

    const id = req.params.groupId;
    userId = req.userData.userId
    Group.findOneAndUpdate({ _id: id, owner: userId }, {
        $pull: { participants: req.body.id }
    }, { new: true })
        .exec()
        .then(result => {
            if (result) {
                User.findOneAndUpdate({
                    _id: req.body.id,
                    groups: {
                        $in: [id]
                    }

                }, {
                    $pull: { groups: id },
                }, {
                    new: true
                }, (err, doc) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    }
                    if(doc){
                        const comment = new Comment({
                            _id: mongoose.Types.ObjectId(),
                            publisher: req.userData.userId,
                            group: id,
                            replyto: req.body.replyto,
                            dataAdded: new Date(),
                            body: "A member was removed by group owner",
                            type: "system"
                        });
                        comment.save();
                    }
                });
                res.status(200).json({
                    message: "updated"
                });
            } else {
                res.status(404).json({
                    message: "No valid content"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};

exports.group_get_group_server = (req, res, next) => {
    const id = req.params.groupId;
    Group.findById(id)
        .populate('servers')
        .populate('participants', 'nickname _id email')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc.servers);
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

}
// //REFACTOR!
// exports.group_add_server = (req, res, next) => {

//     const id = req.params.groupId;
//     userId = req.userData.userId
//     Group.findOneAndUpdate({ _id: id, owner: userId }, {
//         $addToSet: { servers: req.body.id }
//     }, { new: true }).exec()
//         .then(result => {
//             if (result) {
//                 Server.findOneAndUpdate({ _id: req.body.id }, {
//                     $addToSet: { group: id }
//                 }, { new: true }).exec()
//                     .then()
//                     .catch(err => {
//                         console.log(err);
//                         res.status(500).json({
//                             error: err
//                         });
//                     });

//                 res.status(200).json({
//                     message: "updated"
//                 });
//             } else {
//                 res.status(404).json({
//                     message: "No valid content"
//                 });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });

// };
// //REFACTOR!
// exports.group_remove_server = (req, res, next) => {
//     const id = req.params.groupId;
//     userId = req.userData.userId;
//     serverId = req.body.server;
//     const updateOps = {};
//     Group.findOneAndUpdate({ _id: id, owner: userId }, {
//         $pull: { servers: req.body.id }
//     }, { new: true }).exec()
//         .then(result => {
//             if (result) {
//                 Server.findById(id, function (error, server) {
//                     server.remove(function (err) {
//                         if (err) {
//                             res.status(500).json({
//                                 error: err
//                             });
//                         }
//                         else {
//                             res.status(200).json({
//                                 message: "Group deleted"
//                             });
//                         }
//                     });
//                 });
//             } else {
//                 res.status(404).json({
//                     message: "No valid content"
//                 });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });

// };
