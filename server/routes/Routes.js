const express = require("express");
const router = express.Router();
const { verifyToken } = require('../middleware/Middleware');  
const { getVideo } = require("../controller");

router.get("/video/:videoId",verifyToken, getVideo);






module.exports = router;