const db = require("../models");

const index = (req, res) => {
    db.Comment.find({}, (err, foundComments) => {
        if (err) return res.send(err);
        return res.render("comments/index", { 
            comments : foundComments,
            loginUser : req.user 
        });
    })
}

const newComment = (req, res) => {
    db.Comment.find({}, (err, foundComments) => {
        if (err) return res.send(err);
        return res.render("comments/new", {
            comments : foundComments
        });
    });
}

const show = (req, res) => {
    db.Comment.findById(req.params.id)
        .populate("post")
        .populate("user")
        .exec((err, foundComment) => {
            if (err) res.send(err);
            return res.render("comments/show", { 
                comment : foundComment,
                loginUser: req.user
            })
        })
}


const create = (req, res) => {
    db.Comment.create(req.body, (err, createdComment) => {
        if (err) return res.send(err);
        console.log(createdComment, "Created Comment");
        db.Post.findById(createdComment.post)
            .exec((err, foundPost) => {
                if (err) return res.send(err);
                console.log(foundPost, "Found Post");
                foundPost.comments.push(createdComment);
                foundPost.save();
                db.User.findById(createdComment.user)
                    .exec((err, foundUser) => {
                        if (err) return res.send(err);
                        console.log(foundUser, "Found User");
                        foundUser.comments.push(createdComment);
                        foundUser.save();
                        res.redirect(`/posts/${foundPost._id}`)
                    })
            })
    })
}

const edit = (req, res) => {
    db.Comment.findById(req.params.id, (err, foundComment) => {
        if (err) return res.send(err)
        db.Post.findById(foundComment.post, (err, foundPost) => {
            if (err) return res.send(err)
            return res.render("comments/edit", {
                foundComment : foundComment,
                post: foundPost,
                loginUser: req.user
        })
        
        })
    })
}

const update = (req, res) => {
    db.Comment.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                ...req.body,
            }
        },
        { new : true },
        (err, updatedComment) => {
            if (err) return res.send(err);
            return res.redirect(`/posts/${updatedComment.post._id}`)
        }
    )
}

const destroy = (req, res) => {
    db.Comment.findByIdAndDelete(req.params.id, (err, deletedComment) => {
        console.log(deletedComment);
        if (err) return res.sed(err);
        db.Post.findById(deletedComment.post, (err, foundPost) => {
            console.log(foundPost);
            foundPost.comments.remove(deletedComment)
            foundPost.save();
            db.User.findById(deletedComment.user, (err, foundUser) => {
                foundUser.comments.remove(deletedComment)
                foundUser.save();
                res.redirect(`/posts/${foundPost._id}`)
            })
        })
    })
}

module.exports = {
    index,
    newComment,
    show,
    create,
    edit,
    update,
    destroy
}