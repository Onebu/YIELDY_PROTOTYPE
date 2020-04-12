//Imports
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Route path settings
const serverRoutes = require("./api/routes/servers");
const userRoutes = require("./api/routes/users");
const commentRoutes = require("./api/routes/comments");
const groupRoutes = require("./api/routes/groups");

//Mongoose configuration to connect API with mongodb cluster
mongoose.connect(
    "mongodb+srv://Wyang:"
    + process.env.MONGO_ATLAS_PW + 
    "@cluster0-wcekj.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
);

app.use(morgan("dev"));
app.use("/uploads",express.static("uploads"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes which should handle request
app.use("/servers",serverRoutes);
app.use("/users",userRoutes);
app.use("/comments",commentRoutes);
app.use("/groups",groupRoutes);

//CORS settings
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Merhods", "PUT, PATCH, POST, DELETE, GET")
        return res.status(200).json({});
    };
    next();
});

//ERROR handling - 404
app.use((req, res, next ) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
//ERROR handling to return the response with error message
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports = app;