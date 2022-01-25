const router = require("express").Router();

const ctrl = require("../controllers");

router.get("/tags", ctrl.tags.index);
router.get("/tags/new", ctrl.tags.newTag);
router.get("/tags/:id", ctrl.tags.show);
router.get("/tags/:id/edit", ctrl.tags.edit)
router.post("/tags", ctrl.tags.create);
router.put("/tags/:id", ctrl.tags.update);
router.delete("/tags/:id", ctrl.tags.destroy);

module.exports = router;

