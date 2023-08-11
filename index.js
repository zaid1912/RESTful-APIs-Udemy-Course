//jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require('mongoose');
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose, { mongo } from 'mongoose';


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikipedia", {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema = {
    title: String,
    content:String
}

const Article = mongoose.model("Article", articleSchema);


//TODO

/////////////////////////////////////////REQUESTS TARGETTING ALL ARTICLES//////////////////////////////////////////////////////////////////////////


app.get('/articles', async (req, res) => {
  try{
    const foundArticles = await Article.find();
    console.log(foundArticles);
    res.send(foundArticles);
  }
  catch(error){
    console.log(error);
  }
})

app.post("/articles", async(req, res) => {
  try{
    // const title = await(req.body.title);
    // const content = await(req.body.content);
    // console.log(title);
    // console.log(content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    })
    await newArticle.save();
  }
  catch(error){
    console.log(error);

  }
})

app.delete('/articles', async(req, res)=>{
  try{
    await Article.deleteMany();
  }
  catch(error){
    console.log(error);
  }
  })


//////////////////////////////////////REQUESTS TARGETTING A SPECIFIC ARTICLE/////////////////////////////////////////////

app.get('/articles/:articleTitle', async (req, res) => {
  try {
    const oneArticle = await Article.findOne({ title: req.params.articleTitle });

    if (oneArticle) {
      res.send(oneArticle);
    } else {
      res.send("No article found with this title");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.put('/articles/:articleTitle', async (req, res) => {
  try{
    await Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title},
      {content: req.body.content},
      {overwrite: true},
    )
    res.send("Data added");
  }
  catch(error){
    console.log(error);
    res.send(error);
  }
})

app.patch('/articles/:articleTitle', async(req, res) => {
  try{
    await Article.updateOne(
      {title:req.params.articleTitle},
      {$set: req.body}
    )
    res.send("Update Successful");
  }
  catch(error){
    res.send(error);
  }
})

app.delete('/articles/:articleTitle', async(req, res) => {
  try{
    await Article.deleteOne(
      {title: req.params.articleTitle}
    )
    res.send(`Successfully deleted the contents with title ${articleTitle}`);
  }
  catch(error){
    res.send(error);
  }
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});