var express=require("express");
var router=express.Router({mergeParams:true})
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj=require("../middleware");

//Comments New
router.get("/new",middlewareObj.isLoggenIn,function(req,res){
	 // find campground by id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new",{campground:campground})			
		}
	})
})

//Comments Create
router.post("/",middlewareObj.isLoggenIn,function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
			res.redirect("/camgrounds")
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err)
				}
				else{
					 //add username and id to comment
					// console.log(req.user)
					comment.author.username=req.user.username
					comment.author.id=req.user._id
					comment.save()
					campground.comments.push(comment)
					campground.save()
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/"+campground._id)
				}
			})	
		}
	})
})

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middlewareObj.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err || !foundCamp){
			req.flash("error","Campground not found")
			return res.redirect("back")
		}
		Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			res.redirect("back")
		}
		else{
			res.render("comments/edit",{campground_id:req.params.id,comment:foundcomment})
		}
	})
	})
})



// COMMENT UPDATE
router.put("/:comment_id",middlewareObj.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
		if(err){
			res.redirect("/campgrounds/"+req.params.id)
		}
		else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middlewareObj.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back")
		}
		else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})




module.exports=router;