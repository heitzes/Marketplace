const express = require("express");
const Info = require("../models/info");
const router = express.Router();

router.delete("/", async (req, res, next) => {
    try {
        const nft = await Info.destroy({
            where: { tokenID: req.query.tokenID },
        });
        console.log(nft);
        res.json(nft);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
