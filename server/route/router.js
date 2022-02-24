const express = require('express');
const Data = require('../controller/Controller');
const router = express.Router();
router.route("/")
    .post(Data.postData)
    .get(Data.getData)
    .put(Data.putData)

module.exports = router;