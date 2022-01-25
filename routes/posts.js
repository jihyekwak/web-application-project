const router = require("express").Router();
const ctrl = require("../controllers");
const upload = require("../middleware/upload")

router.get("/", ctrl.posts.index, ctrl.tags.index);
router.get("/new", ctrl.posts.newPost);
router.get("/:id", ctrl.posts.show);
router.get("/:id/edit", ctrl.posts.edit);
router.post("/", upload.single('image'), ctrl.posts.create);
router.put("/:id", ctrl.posts.update);
router.delete("/:id", ctrl.posts.destroy);

module.exports = router;