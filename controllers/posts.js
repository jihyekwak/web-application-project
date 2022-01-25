const req = require("express/lib/request");
const db = require("../models");

// Index
const index = (req, res) => {
    db.Post.find({}, (err, foundPosts) => {
        if (err) return res.send(err);
        db.Tag.find({}, (err, foundTags) => {
            if (err) return res.send(err);
            res.render("posts/index", {
                posts : foundPosts,
                tags : foundTags,
                loginUser : req.user
            });
        });
    }
)}

// Show
const show = (req, res) => {
    db.Post.findById(req.params.id)
        .populate("user")
        .populate("tag")
        .populate("comments")
        .exec((err, foundPost) => {
            if (err) return res.send(err)
            console.log(foundPost, "found post")
            res.render("posts/show", {
                loginUser: req.user,
                post: foundPost
            })
        })
};

// New post
const newPost = (req, res) => {
    const post = new db.Post();
    db.User.find({}, (err, foundUsers) => {
        if (err) return res.send(err);
        db.Tag.find({}, (err, foundTags) => {
            if (err) return res.send(err);
            res.render("posts/new", {
                users : foundUsers,
                tags : foundTags,
                loginUser : req.user,
                post: post
            })
        })
    })
};

// Create
const create = async (req, res) => {
    const post = new db.Post({
        title: req.body.title,
        caption: req.body.caption,
        tag: req.body.tag,
        user: req.user
    })
    if (req.file) {
        post.image = req.file.path
    }
    const createdPost = await post.save();
    console.log(createdPost, "created post")
    db.User.findById(createdPost.user)
        .exec((err, foundUser) => {
            if (err) return res.send(err)
            console.log(foundUser, "found user")
            foundUser.posts.push(createdPost)
            foundUser.save();
            db.Tag.findById(createdPost.tag)
                .exec((err, foundTag) => {
                if (err) return res.send(err)
                console.log(foundTag, "found tag")
                foundTag.posts.push(createdPost)
                foundTag.save();
                res.redirect(`/users/${foundUser._id}`)
            })
        })
}

const edit = (req, res) => {
    db.Post.findById(req.params.id, (err, foundPost) => {
        if (err) return res.send(err);
        db.Tag.find({}, (err, foundTags) => {
            if (err) return res.send(err);
            res.render("posts/edit", {
                post : foundPost,
                tags : foundTags,
                loginUser : req.user
            })
        })
    })
}

// Update
const update = (req, res) => {
    db.Post.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                ...req.body
            }
        }, 
        { new : true },
        (err, updatedPost) => {
            if (err) return res.send(err)
            console.log(updatedPost, "updated post")
            return res.redirect(`/posts/${updatedPost._id}`)
        }
    )
}

// Delete

const destroy = (req, res) => {
    db.Post.findByIdAndDelete(req.params.id, (err, deletedPost) => {
        console.log(deletedPost);
        if (err) return res.send(err);
        db.User.findById(deletedPost.user, (err, foundUser) => {
            console.log(foundUser, "foundUser");
            foundUser.posts.remove(deletedPost)
            foundUser.save()
            db.Tag.findById(deletedPost.tag, (err, foundTag) => {
                foundTag.posts.remove(deletedPost)
                foundTag.save();
                db.Comment.deleteMany({ post : deletedPost._id }, (err, deletedComments) => {
                    console.log(deletedComments, "deleted comments")
                    if (err) return res.send(err);
                    res.redirect("/posts");
                })
            })
        })
    })
}


module.exports = {
    index,
    show,
    newPost,
    create,
    edit,
    update,
    destroy,
}