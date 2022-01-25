const router = require("express").Router();

const ctrl = require("../controllers");
const upload = require("../middleware/upload")

router.get("/", ctrl.users.index, ctrl.users.isLoggedIn);
router.get("/:id", ctrl.users.show, ctrl.users.isLoggedIn);
router.get("/new", ctrl.users.newUser);
router.get("/:id/edit", ctrl.users.edit);
router.post("/", ctrl.users.create);
router.put("/:id", upload.single('image'), ctrl.users.update);
router.delete("/:id", ctrl.users.destroy);

module.exports = router;