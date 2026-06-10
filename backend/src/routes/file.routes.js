const router = require("express").Router();
const upload = require("../middleware/upload");
const checkSecret = require("../middleware/checkSecret");
const ctrl = require("../controllers/file.controller");

router.post("/upload", checkSecret, upload.array("files", 20), ctrl.uploadFiles);
router.get("/", ctrl.listFiles);
router.delete("/:id", ctrl.deleteFile);

module.exports = router;
