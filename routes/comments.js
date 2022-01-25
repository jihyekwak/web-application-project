const router = require("express").Router();

const ctrl = require("../controllers");

router.get("/comments", ctrl.comments.index);
router.get("/comments/:id", ctrl.comments.show);
router.get("/comments/new", ctrl.comments.newComment);
router.get("/comments/:id/edit", ctrl.comments.edit);
router.post("/posts/:id/comments", ctrl.comments.create);
router.put("/comments/:id", ctrl.comments.update);
router.delete("/comments/:id", ctrl.comments.destroy);

module.exports = router;