var mongoose=require("mongoose"),
	passportLocalStrategy=require("passport-local-mongoose")

var UserSchema=new mongoose.Schema({
	username:String,
	password:String
})

mongoose.plugin(passportLocalStrategy)

module.exports=mongoose.model("User",UserSchema)