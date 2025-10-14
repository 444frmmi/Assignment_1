const express = require("express");
const router = express.Router();
const { getConfig } = require("../controllers/config.Controller");

router.get("/:droneId", getConfig);

module.exports = router;