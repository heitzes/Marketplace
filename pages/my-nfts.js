import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { getCurrentWalletConnected } from "./interact.js";
const { utils } = require("ethers");

export default function MyAssets({ showPopup, isUnlocked, connection, provider }) {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
    const router = useRouter();
    useEffect(() => {
        loadNFTs();
    }, []);

    async function loadNFTs() {
        try {
            connection(await isUnlocked())
                .then(async () => {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    let res = await axios.get("http://localhost:8080/fetch/my", {
                        params: { address: address },
                    });
                    console.log(res);
                    console.log(res.data);
                    const items = res.data.map(i => {
                        let item = {
                            price: i.price,
                            tokenID: i.tokenID,
                            tokenURI: i.tokenURI,
                            image: `https://ipfs.infura.io/ipfs/${i.image}`,
                            name: i.name,
                            description: i.description,
                            owner: i.owner,
                        };
                        return item;
                    });
                    setNfts(items);
                    setLoadingState("loaded");
                })
                .catch(() => {
                    showPopup();
                });
        } catch (err) {
            console.error(err);
        }
    }

    function listNFT(nft) {
        router.push(`/resell-nft?id=${nft.tokenID}&uri=${nft.tokenURI}&seller=${nft.owner}`);
    }
    if (loadingState === "loaded" && !nfts.length)
        return <h1 className="py-10 px-20 text-3xl h-screen">No NFTs owned</h1>;
    return (
        <div className="h-screen">
            <div className="flex justify-center">
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
                        {nfts.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden mt-8">
                                <div id="wrapper" className="relative overflow-hidden">
                                    <div id="image" className="object-cover">
                                        <img
                                            src={nft.image}
                                            style={{ maxHeight: "256px" }}
                                            className="rounded"
                                        />
                                    </div>
                                    <div
                                        id="text"
                                        className="absolute bottom-0 left-0 bg-black opacity-0 hover:opacity-80"
                                        style={{ height: "128px", width: "256px" }}
                                    >
                                        <p className="p-5 text-center text-2xl">{nft.name}</p>
                                        <p className="p-3 text-center text-white text-xl">
                                            {nft.description}
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-black"></span>
                                <div className="p-1 bg-black flex flex-row justify-center mt">
                                    <p className="font-bold text-white text-xl p-3 pr-7 text-center">
                                        {nft.price} Eth
                                    </p>
                                    <button
                                        className="text-onomapurple text-xl font-bold rounded p-3 pl-7 text-center"
                                        onClick={() => listNFT(nft)}
                                    >
                                        List
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
