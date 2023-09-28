const mongoose=require("mongoose");

const BlogSchema=mongoose.Schema({
title:String,
content:String,
category:String,
date:String,
likes:String,
comments:[{String}]
});


const BlogModel=mongoose.model("blog",BlogSchema);

module.exports=BlogModel;

