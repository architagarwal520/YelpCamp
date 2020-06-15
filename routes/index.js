var express=require("express"),
	router=express.Router()
var passport = require("passport");
var User = require("../models/user");
var middlewareObj=require("../middleware");

//root route
router.get("/",function(req,res){
	res.render("landing")
	console.log(req.user)
})

// show register form
router.get("/register",function(req,res){
	res.render("register")
})

//handle sign up logic
router.post("/register",function(req,res){
	var newUSer=new User({username:req.body.username})
	User.register(newUSer,req.body.password,function(err,user){
		if(err){
			req.flash("error", err.message);
			return res.render("register")
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds")
		})
	})
})

//show login form
router.get("/login",function(req,res){
	res.render("login")	
})

//handling login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
	}),function(req,res){
	})

// logout route
router.get("/logout",function(req,res){
	req.logout()
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds")
})


// function isLoggenIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next()
// 	}
// 	res.redirect("/login")
// }

module.exports=router;
