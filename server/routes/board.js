const express = require("express");

const router = express.Router();

const controller = require("../controllers/board.js");

router.get("/", controller.getBoard);
router.get("/detail", controller.getDetailBoard);
router.post("/regist", controller.registBoard);
router.post("/delete", controller.deleteBoard);
router.post("/update", controller.updateBoard);

module.exports = router;
