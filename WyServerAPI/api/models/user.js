const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');


mongoose.set('useCreateIndex', true);
//add owned server, participated server(or group)
const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nickname:{type:String, required:true, unique:true},
    password: {type: String, required: true},
    email:{ type:String, 
                required: true, 
                unique: true,
                immutable: true,
                match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    profileImage:{type:String},
    confirmed:{type:Boolean,default:false},
    groups:[{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
    dateJoined:{type: Date, required: true,immutable: true}
});

userSchema.plugin(mongoosastic,{
  hosts:[
      "localhost:9200"
  ]
});

module.exports = mongoose.model("User",userSchema);