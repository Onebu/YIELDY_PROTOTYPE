const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');


mongoose.set('useCreateIndex', true);

const groupSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User',immutable: true},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    name:{type: String,required:true},
    dataCreated:{type: Date, required: true,immutable: true}
});

groupSchema.plugin(mongoosastic,{
    hosts:[
        "localhost:9200"
    ]
});
module.exports = mongoose.model("Group",groupSchema);