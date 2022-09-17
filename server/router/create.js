const express = require("express");
const Info = require("../models/info");

const router = express.Router();

// server에 request가 왔을때 하는 작업들
router.post("/", async (req, res, next) => {
    try {
        const nft = await Info.create({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            tokenURI: req.body.tokenURI,
            owner: req.body.owner,
            seller: req.body.seller,
        });
        console.log(nft);
        res.json(nft);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
