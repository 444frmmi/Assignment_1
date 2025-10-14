const express = require("express");
const router = express.Router();
const { getLogs, createLog } = require("../controllers/log.Controller");

router.get("/:droneId", getLogs);
router.post("/", createLog);

module.exports = router;