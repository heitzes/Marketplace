const express = require("express");
const Info = require("../models/info");
const router = express.Router();

router.patch("/resell", async (req, res, next) => {
    try {
        const nft = await Info.update(
            {
                owner: req.body.owner,
                seller: req.body.seller,
                price: req.body.price,
                signature: req.body.signature,
            },
            {
                where: { tokenID: req.body.tokenID },
            }
        );
        console.log(nft);
        res.json(nft);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch("/all", async (req, res, next) => {
    try {
        const nft = await Info.update(
            {
                seller: req.body.seller,
                owner: req.body.owner,
                minted: true,
            },
            {
                where: { tokenID: req.body.tokenID },
            }
        );
        console.log(nft);
        res.json(nft);
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.patch("/owner", async (req, res, next) => {
    try {
        const nft = await Info.update(
            {
                owner: req.body.owner,
            },
            {
                where: { tokenID: req.body.tokenID },
            }
        );
        console.log(nft);
        res.json(nft);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch("/sig", async (req, res, next) => {
    try {
        const sig = await Info.update(
            {
                signature: req.body.signature,
            },
            {
                where: { tokenID: req.body.tokenID },
            }
        );
        console.log(sig);
        res.json(sig);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
