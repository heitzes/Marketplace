const express = require("express");
const Info = require("../models/info");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res, next) => {
    try {
        const nfts = await axios.get("http://0.0.0.0:8080/fetch/main");
        res.json(nfts.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});
module.exports = router;
