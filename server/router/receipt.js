const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const axios = require("axios");
const marketplaceAddress = "0xD9b4Db527845e7D58EF7cC48D04310c56f4F9C63";
require("dotenv").config();
//import { ethers } from "ethers";
//import { marketplaceAddress } from "../config";
//import OnomaContract from "../OnomaContract.json";

router.post("/", async (req, res, next) => {
    //step 0. use etherscan api to get receipt

    try {
        //step 1. Change owner of nft immediately so that current nft is not buyed twice
        //at first change owner to "" and if tx success, update owner
        try {
            //step 1. Change owner of nft immediately so that current nft is not buyed twice
            //at first change owner to "" and if tx success, update owner
            try {
                const update = await axios.patch("http://0.0.0.0:8080/update/owner", {
                    tokenID: req.body.tokenID,
                    owner: "0x",
                });
            } catch (err) {
                console.error(err);
            }

            //step 2. Waiting for a transaction receipt
            const expectedBlockTime = 2000;
            const sleep = milliseconds => {
                return new Promise(resolve => setTimeout(resolve, milliseconds));
            };
            let receipt = null;
            while (receipt == null) {
                receipt = await axios.post(process.env.API_URL, {
                    jsonrpc: "2.0",
                    method: "eth_getTransactionReceipt",
                    params: [req.body.tx],
                    id: 0,
                });
                receipt = receipt.data.result;
                console.log("receipt.data.result: ", receipt);
                await sleep(expectedBlockTime);
            }

            //step 3-1. If transaction successed, update nft info
            if (receipt.status == "0x1") {
                console.log("done! receipt.status: ", receipt.status);
                try {
                    const update = await axios.patch("http://0.0.0.0:8080/update/all", {
                        tokenID: req.body.tokenID,
                        seller: req.body.seller,
                        owner: req.body.owner,
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            //step 3-2. If transaction failed, update nft owner back to previous owner
            else {
                console.log("transaction failed! ", receipt.status);
                //change owner back
                try {
                    const update = await axios.patch("http://0.0.0.0:8080/update/owner", {
                        tokenID: req.body.tokenID,
                        owner: req.body.prevowner,
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
