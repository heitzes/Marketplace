import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentWalletConnected } from "./interact.js";
import { useRouter } from "next/router";

export default function CreatorDashboard({ showPopup, isUnlocked, connection, provider }) {
    const router = useRouter();
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
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
                    let res = await axios.get("http://localhost:8080/fetch/dash", {
                        params: { address: address },
                    });
                    console.log(res.data);
                    const items = res.data.map(i => {
                        let item = {
                            price: i.price,
                            tokenId: i.tokenID,
                            image: `https://ipfs.infura.io/ipfs/${i.image}`,
                            name: i.name,
                            description: i.description,
                            minted: i.minted,
                            tokenURI: i.tokenURI,
                            owner: i.owner,
                            seller: i.seller,
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

    //CancelSale
    async function cancelSale(nft) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(nft);
        try {
            await axios.patch("http://localhost:8080/update/resell", {
                tokenID: nft.tokenId,
                owner: address,
                price: nft.price,
                seller: "0x",
                signature: "",
            });
        } catch (err) {
            console.error(err);
        }
        router.push("/my-nfts");
    }

    function changePrice(nft) {
        router.push(`/resell-nft?id=${nft.tokenId}&uri=${nft.tokenURI}&seller=${nft.seller}`);
    }
    if (loadingState === "loaded" && !nfts.length)
        return <h1 className="py-10 px-20 text-3xl h-screen">No NFTs listed</h1>;
    return (
        <div className="h-screen">
            <div className="flex justify-center">
                <div className="p-4">
                    <h2 className="text-2xl py-2">Items Listed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        {nfts.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden">
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
                                <div className="p-3 pl-5 bg-black flex flex-row justify-around">
                                    <span>
                                        <p className="font-bold">price</p>

                                        <p className="text-2xl font-bold text-white">
                                            {nft.price} Eth
                                        </p>
                                        <button
                                            onClick={() => changePrice(nft)}
                                            className="text-white text-base rounded"
                                        >
                                            change
                                        </button>
                                    </span>
                                    <span className="align-center">
                                        <button
                                            onClick={() => cancelSale(nft)}
                                            className={
                                                nft.minted
                                                    ? "p-2 text-onomapurple text-base font-bold rounded"
                                                    : "text-transparent"
                                            }
                                            disabled={!nft.minted}
                                        >
                                            Cancel
                                        </button>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
