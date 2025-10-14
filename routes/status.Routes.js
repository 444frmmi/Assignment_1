const express = require("express");
const router = express.Router();
const { getStatus } = require("../controllers/status.Controller");

router.get("/:droneId", getStatus);

module.exports = router;