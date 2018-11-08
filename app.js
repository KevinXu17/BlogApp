var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")
var expressSanitizer = require("express-sanitizer")

// connect databases APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(expressSanitizer())
// MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema)
//title image body created
// RESTFUL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs")   // < ------- redirect put in web
})

// app.get("/blogs", function(req, res) {
//     res.render("index")
// })
// INDEX ROUTE
app.get("/blogs", function(req, res) {
    Blog.find({}, function(error, outputBlog){
        if (error) {
           // alert(error)
           res.render("index")
        } else {
            res.render("index", {blogs: outputBlog})
        }
    }) 
})
// NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new")
})
// CREATE ROUTE
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(error, newBlog) {
        if (error) {
            //alert(error)
            res.render("new")
        } else {
            res.redirect("/blogs")
        }
    })
})
// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(error, foundBlog) {
        if (error) {
           // alert(error)
            res.render("index")
        } else {
            res.render("show", {blog: foundBlog})
        }
    })
})
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(error, foundBlog) {
         if (error) {
           // alert(error)
            res.render("edit")
        } else {
            res.render("edit", {blog: foundBlog})
        }
    })
})

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updateBlog) {
        if (error) {
            res.render("show")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(error) {
        if (error) {
            res.render("/blogs/" + req.params.id)
        } else {
            res.redirect("/blogs")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is runing")
})