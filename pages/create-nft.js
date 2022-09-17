/* pages/create-nft.js */
import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { marketplaceAddress } from "../config";
// const marketplaceAddress = require("../config");
import Web3Modal from "web3modal";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
import { getCurrentWalletConnected } from "./interact.js";
import axios from "axios";

export default function CreateItem({ showPopup, isUnlocked, connection, provider }) {
    const [img, setImg] = useState(null);
    const [formInput, updateFormInput] = useState({
        price: "",
        name: "",
        description: "",
    });
    const router = useRouter();

    async function onChange(e) {
        /* upload image to IPFS */
        const file = e.target.files[0];
        setImg(file);
    }

    async function uploadImg() {
        // moved img uploading logic to here
        try {
            const added = await client.add(img, {
                progress: prog => console.log(`received: ${prog}`),
            });
            //image url
            //const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            return added.path;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    async function uploadToIPFS(hash) {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !hash) return;
        /* first, upload metadata to IPFS */
        const data = JSON.stringify({
            name,
            description,
            image: `https://ipfs.infura.io/ipfs/${hash}`,
        });
        try {
            const added = await client.add(data);
            console.log("added: ", added);
            //const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
            return added.path;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    async function createVoucher(tokenId, uri, minPrice = 0, seller) {
        const voucher = { tokenId, uri, minPrice };
        const domain = {
            name: "LazyNFT-Voucher",
            version: "1",
            verifyingContract: marketplaceAddress,
            chainId: 3,
        };
        const types = {
            NFTVoucher: [
                { name: "tokenId", type: "uint256" },
                { name: "minPrice", type: "uint256" },
                { name: "uri", type: "string" },
            ],
        };

        try {
            const signature = await seller._signTypedData(domain, types, voucher);
            return signature;
        } catch (err) {
            return false;
        }
    }

    async function listNFTForSale() {
        try {
            connection(await isUnlocked())
                .then(async () => {
                    const imghash = await uploadImg();
                    const urihash = await uploadToIPFS(imghash);

                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const wallet = await signer.getAddress();
                    let uploaded = await axios.post("http://localhost:8080/create", {
                        name: formInput.name,
                        description: formInput.description,
                        image: imghash,
                        price: formInput.price,
                        tokenURI: urihash,
                        owner: marketplaceAddress,
                        seller: wallet,
                    });
                    const nft = uploaded.data;
                    console.log(nft);
                    const buyprice = ethers.utils.parseUnits(nft.price.toString(), "ether");
                    const signature = await createVoucher(
                        nft.tokenID,
                        nft.tokenURI,
                        buyprice,
                        signer
                    );

                    if (signature) {
                        let sigload = await axios.patch("http://localhost:8080/update/sig", {
                            tokenID: nft.tokenID,
                            signature: signature,
                        });
                        console.log(sigload);
                    } else {
                        console.log(nft.tokenID);
                        let del = await axios.delete("http://localhost:8080/delete", {
                            params: { tokenID: nft.tokenID },
                        });
                        console.log(del);
                    }
                    router.push("/");
                })
                .catch(() => {
                    showPopup();
                });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="h-screen bg-black">
            <div className="flex justify-center mt-12 ">
                <div className="w-1/2 flex flex-col outline outline-onomablue outline-2 outline-offset-8 rounded">
                    <input
                        placeholder="Asset Name"
                        className="mt-8 border rounded p-4 text-black"
                        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                    <textarea
                        placeholder="Asset Description"
                        className="mt-2 border rounded p-4 text-black"
                        onChange={e =>
                            updateFormInput({ ...formInput, description: e.target.value })
                        }
                    />
                    <input
                        placeholder="Asset Price in Eth"
                        className="mt-2 border rounded p-4 text-black"
                        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                    <input type="file" name="Asset" className="my-4" onChange={onChange} />
                    {/* {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />} */}
                    <button
                        onClick={listNFTForSale}
                        className="bg-onomapurple text-white font-bold rounded p-3 m-6 w-1/3 self-center "
                    >
                        Create NFT
                    </button>
                </div>
            </div>
        </div>
    );
}
