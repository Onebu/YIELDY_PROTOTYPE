const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');
//server schema definition
const serverSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: {type: String, required:true},
    ipv4: {type: Boolean, required:true},
    ipv6: {type: Boolean, required:true},
    name: {type: String, reqiured:true},
    host: {type: String, required:true},
    location: {type: String, required:true},
    uptime: {type: Number, required:true},
    load: {type: Number, required:true},
    downloads: {type: Number, required:true},
    uploads: {type: Number, required:true},
    cpu: {type: Number, required:true},
    ram: {type: Number, required:true},
    hdd: {type: Number, required:true},
    group:{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
});
//link serverschema to elasticsearch with mongoosastic plugin
serverSchema.plugin(mongoosastic,{
    hosts:[
        "localhost:9200"
    ]
});

module.exports = mongoose.model("Server",serverSchema);