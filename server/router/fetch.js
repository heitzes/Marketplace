const express = require("express");
const Info = require("../models/info");
const router = express.Router();
const marketplaceAddress = "0xD9b4Db527845e7D58EF7cC48D04310c56f4F9C63";

router.get("/main", async (req, res, next) => {
    console.log("~~~~~~~add~~~~~~:", marketplaceAddress);
    try {
        const nfts = await Info.findAll({
            where: { owner: marketplaceAddress },
        });
        res.json(nfts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/sig", async (req, res, next) => {
    try {
        const sig = await Info.findOne({ where: { tokenID: req.query.tokenID } });
        res.json({ signature: sig.dataValues.signature });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/my", async (req, res, next) => {
    try {
        const nfts = await Info.findAll({ where: { owner: req.query.address } });
        res.json(nfts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/dash", async (req, res, next) => {
    try {
        const nfts = await Info.findAll({ where: { seller: req.query.address } });
        res.json(nfts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
