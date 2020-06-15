var express=require("express"),
	router=express.Router()
var Campground = require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj=require("../middleware");

//INDEX - show all campgrounds
router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds})
		}
	})	
});

//CREATE - add new campground to DB
router.post("/",middlewareObj.isLoggenIn,function(req,res){
	// get data from form and add to campgrounds array
	var name=req.body.name
	var image=req.body.image
	var price=req.body.price
	var desc=req.body.description
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,price:price,image:image,description:desc,author:author}
	// Create a new campground and save to DB
	Campground.create(newCampground,function(err,campgroundcreated){
		if(err){
			console.log(err)
		}
		else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds")
		}
	})	
});


//NEW - show form to create new campground
router.get("/new",middlewareObj.isLoggenIn,function(req,res){
	res.render("campgrounds/new")
})

// SHOW - shows more info about one campground
router.get("/:id",function(req,res){
	 //find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err || !foundCamp){
			req.flash("error","Campground not found")
			console.log(err)
			res.redirect("/campgrounds")
		}
		else{
			console.log(foundCamp)
			//render show template with that campground
			res.render("campgrounds/show",{campground:foundCamp})
		}
	})
})

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middlewareObj.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err){
			res.redirect("back")
		}
		else{
			res.render("campgrounds/edit",{campground:foundCamp})
		}
	})

})

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middlewareObj.checkCampgroundOwnership,function(req,res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campgroundedited){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middlewareObj.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err,removedCampground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			Comment.deleteMany({_id:{$in:removedCampground.comments}},function(err){
				if(err){
					console.log(err)
				}
				else{
					res.redirect("/campgrounds")
				}
			})
		}	
	})
})
  

			

module.exports=router;