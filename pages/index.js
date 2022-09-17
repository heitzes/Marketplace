import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { marketplaceAddress } from "../config";
// const marketplaceAddress = require("../config");
import OnomaContract from "../OnomaContract.json";
const alchemyKey = process.env.API_URL;

export default function Home({ showPopup, isUnlocked, connection, provider }) {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");

    async function loadNFTs() {
        try {
            let res = await axios.get("http://localhost:8080/fetch/main");
            const items = res.data.map(i => {
                let item = {
                    price: i.price,
                    tokenID: i.tokenID,
                    image: `https://ipfs.infura.io/ipfs/${i.image}`,
                    name: i.name,
                    description: i.description,
                    tokenURI: i.tokenURI,
                    owner: i.owner,
                    minted: i.minted,
                };
                return item;
            });
            setNfts(items);
            setLoadingState("loaded");
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(async () => {
        loadNFTs();
    }, []);

    async function buyNft(nft) {
        try {
            // Do connection checking HERE
            connection(await isUnlocked())
                .then(async () => {
                    //Get provider from Metamask
                    const provider = new ethers.providers.Web3Provider(window.ethereum);

                    // Set signer
                    const signer = provider.getSigner();

                    // get address
                    const address = await signer.getAddress();

                    const buyprice = ethers.utils.parseUnits(nft.price.toString(), "ether");
                    const signature = await axios.get("http://localhost:8080/fetch/sig", {
                        params: { tokenID: nft.tokenID },
                    });
                    const sig = signature.data.signature;
                    const voucher = {
                        tokenId: nft.tokenID,
                        uri: nft.tokenURI,
                        minPrice: buyprice,
                        signature: sig,
                    };

                    const contract = new ethers.Contract(
                        marketplaceAddress,
                        OnomaContract.abi,
                        signer
                    );
                    if (!nft.minted) {
                        var transaction = await contract.redeem(address, voucher, {
                            value: buyprice,
                        });
                    } else {
                        var transaction = await contract.resell(address, voucher, {
                            value: buyprice,
                        });
                    }
                    await axios.post("http://localhost:8080/receipt", {
                        tx: transaction.hash,
                        tokenID: nft.tokenID,
                        prevowner: nft.owner,
                        owner: address,
                        seller: "0x",
                    });
                })
                .catch(err => {
                    console.error(err);
                    if (isUnlocked()) {
                        window.location.reload();
                    } else {
                        showPopup();
                    }
                });
        } catch (err) {
            console.error(err);
        }
    }
    if (loadingState === "loaded" && !nfts.length)
        return <h1 className="px-20 py-10 text-3xl h-screen">No items in marketplace</h1>;
    return (
        <div className="flex justify-center" style={{ minHeight: "1000px" }}>
            <div className="px-4" style={{ maxWidth: "1800px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
                    {nfts.map((nft, i) => (
                        <div key={i} className="border shadow rounded-xl overflow-hidden mt-8">
                            <img
                                src={nft.image}
                                style={{ maxHeight: "256px" }}
                                className="border-b"
                            />
                            <div className="p-2 border-b">
                                <p style={{ height: "32px" }} className="text-xl font-semibold">
                                    {nft.name}
                                </p>
                                <div style={{ height: "30px", overflow: "hidden" }}>
                                    <p className="text-sm mt-2">{nft.description}</p>
                                </div>
                            </div>
                            <div className="p-1 bg-black flex flex-row justify-around mt p-5">
                                <p className="text-white text-base font-bold self-center">
                                    {nft.price} ETH
                                </p>
                                <button
                                    className="text-onomapurple text-base font-bold rounded"
                                    onClick={() => buyNft(nft)}
                                >
                                    Buy now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
