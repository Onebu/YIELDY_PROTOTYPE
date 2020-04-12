const Comment = require("../models/comment");
const User = require("../models/user");
const mongoose = require("mongoose");

//Mongoosastic sync & index mongodb to elasticsearch
Comment.createMapping(function (err, mapping) {
    if (err) {
        console.log("err creating mapping");
        console.log(err);
    } else {
        console.log("Comments mapping created");
    }
});
const stream = Comment.synchronize();
var count = 0;
stream.on("data", function () {
    count++;
});
stream.on("close", function () {
    console.log("Indexed " + count + " docs in comments collection");
});
stream.on("error", function (err) {
    console.log(err);
});

//Get all the comments in database 
exports.comment_get_all = (req, res, next) => {

    Comment.find()
        .sort('dataAdded')
        .populate('group', 'name _id')
        .populate('publisher', 'nickname _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                comments: docs.map(doc => {
                    return {
                        _id: doc.id,
                        publisher: doc.publisher,
                        server: doc.server,
                        replyto: doc.replyto,
                        dataAdded: doc.dataAdded,
                        group: doc.group,
                        body: doc.body,
                        type: doc.type
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

//Get a comment in the database by id
exports.comment_get_comment_by_id = (req, res, next) => {

    const id = req.params.commentId;
    Comment.findById(id)
        .populate('group', 'name _id')
        .populate('publisher', 'nickname _id')
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
            res.status(500).json({
                error: err
            });
        });
};

//Get all comments from user's groups(System messages included)
exports.comment_get_comment_related = (req, res, next) => {

    User.findById(req.userData.userId)
        .exec()
        .then(doc => {
            const groups = doc.groups.map(s => mongoose.Types.ObjectId(s));
            Comment.find({ group: { $in: groups } })
                .sort('dataAdded')
                .populate('group', 'name _id')
                .populate('publisher', 'nickname _id')
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

        });

};

//Get all comment stored in database by group id
exports.comment_get_comment_by_group = (req, res, next) => {

    const id = req.params.groupId;
    Comment.find({ group: id }).sort('dataAdded')
        .populate('group', 'name _id')
        .populate('publisher', 'nickname _id')
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

//Get logged user's comment (by user's token)
exports.comment_get_comment_me = (req, res, next) => {

    Comment.find({ publisher: req.userData.userId, type: "user" })
        .sort('dataAdded')
        .populate('group', 'name _id')
        .populate('publisher', 'nickname _id')
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
//search comment's by it's content 
exports.comment_get_comment_by_content = (req, res, next) => {

    const content = req.params.content;
    Comment.search({
        "query_string": {
            "default_field": "body",
            "query": "*" + content + "*",
            "fuzziness": "AUTO"
        }
    },
        { sort: "dataAdded:asc" }
        , function (err, results) {
            if (err) {
                res.status(404).json({
                    error: err
                });
            }
            else if (results) {
                res.status(200).json(results.hits.hits.map(result => {
                        return {
                            _id: result._id,
                            content: result._source
                        }
                    })
                );
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
        });

};

//Post a comment to database (Also have to provide a valid access token/)
exports.comment_post_comment = (req, res, next) => {

    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        publisher: req.userData.userId,
        group: req.body.group,
        replyto: req.body.replyto,
        dataAdded: new Date(),
        body: req.body.body,
        type: req.body.type
    });
    if (true) {
        comment.save()
            .then(result => {
                res.status(201).json({
                    message: "comment created",
                    createdComment: {
                        _id: result._id,
                        publisher: result.publisher,
                        group: result.group,
                        replyto: result.replyto,
                        dataAdded: result.dataAdded,
                        body: result.body,
                        type: result.type
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

    }

}


