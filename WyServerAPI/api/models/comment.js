const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');

//Create index that allow the API to connect with elasticsearch by mongoosastic.
mongoose.set('useCreateIndex', true);

const commentSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    publisher: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
    group:{type:mongoose.Schema.Types.ObjectId, ref: 'Group',required: true},
    replyto: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    dataAdded:{type: Date, required: true},
    body:{type: String, required: true},
    type:{type:String,required:true}, //Type could be "user"(Comment's published by user) or "system"(System message). 
});

commentSchema.plugin(mongoosastic,{
    hosts:[
        "localhost:9200"
    ]
});
module.exports = mongoose.model("Comment",commentSchema);