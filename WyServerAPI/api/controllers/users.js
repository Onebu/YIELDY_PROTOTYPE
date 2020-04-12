const User = require("../models/user");
const mongoose = require("mongoose");
const Group = require("../models/group");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenList = {}

//Mongoosastic sync& index mongodb to elasticsearch
User.createMapping(function (err, mapping) {
    if (err) {
        console.log("err creating mapping");
        console.log(err);
    } else {
        console.log("User Mapping created");
        //console.log(mapping);
    }
});

const stream = User.synchronize();
var count = 0;
stream.on("data", function () {
    count++;
});
stream.on("close", function () {
    console.log("Indexed " + count + " docs in user collection");
});
stream.on("error", function (err) {
    console.log(err);
});


//get all users
exports.users_get_all = (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                users: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};


exports.user_search_by_name = (req, res, next) => {
    User.findOne({ nickname: new RegExp('^' + req.params.name + '$', "i") }, function (err, doc) {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: "User not found"
            });
        }
    });
}
//get user by id
exports.users_get_by_id = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
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
//patch(update) user by id
exports.users_patch = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    if (id === req.userData.userId) {
        //console.log(req.file.length>0);
        if (req.file) {
            updateOps["profileImage"] = req.file.path
        } else {
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
        }
        User.update({ _id: id }, {
            $set:
                updateOps
        }).exec()
            .then(result => {
                res.status(200).json({
                    messge: "Updated"
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } else {
        return res.status(404).json({
            message: "no valid entry"
        });
    }

};
//delete a user by its id 
exports.users_delete = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id, function (error, user) {
        user.remove(function (err) {
            if (err) {
                res.status(500).json({
                    error: err
                });
            }
            else {
                res.status(200).json({
                    message: "User deleted"
                });
            }
        });
    });
};
//sign up method
exports.sign_up = (req, res, next) => {

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(req.body.password) || req.body.password.length < 8) {
        return res.status(409).json({
            message: "Password must contains one uppercase , one lower case and one number with more o than 8 letters"
        });
    } else {
        User.find({ nickname: req.body.nickname })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Nickname exists"
                    });
                }
            });
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Mail exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash,
                                nickname: req.body.nickname,
                                dateJoined: new Date()
                            });
                            user.save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "User created"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    });
                }
            });

    }



};
//login method
exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            userId: user[0]._id,

                        }, process.env.JWT_KEY,
                            {
                                expiresIn: "15000000" //espiration of logged user
                            });
                        const refreshToken = jwt.sign({
                            userId: user[0]._id,

                        }, process.env.JWT_KEY_2,
                            {
                                expiresIn: "150000000" //espiration of logged user
                            });
                        const response = {
                            message: "Auth successful",
                            userInfo: {
                                id: user[0].id,
                                name: user[0].nickname,
                                email: user[0].email,
                                profileimage: user[0].profileImage,
                                groups: user[0].groups,
                            },
                            token: token,
                            refreshToken: refreshToken
                        }
                        tokenList[refreshToken] = response;
                        return res.status(200).json(response);
                    }
                    res.status(401).json({
                        message: "Auth failed"
                    });
                });
            }
        });
};

//get logged user 
exports.users_get_me = (req, res, next) => {
    const id = req.userData.userId;
    console.log(id);
    User.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    id: doc.id,
                    name: doc.nickname,
                    email: doc.email,
                    profileimage: doc.profileImage,
                    groups: doc.groups
                }
                );
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
//WIP
exports.refresh = (req, res, next) => {
    const postData = req.body;

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            } else if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            userId: user[0]._id,

                        }, process.env.JWT_KEY,
                            {
                                expiresIn: "15000000" //espiration of logged user
                            });
                        const response = {
                            "token": token,
                        }
                        // update the token in the list
                        tokenList[postData.refreshToken].token = token
                        res.status(200).json(response);
                    }
                });
            }
        });
};


