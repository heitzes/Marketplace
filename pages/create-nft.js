/* pages/create-nft.js */
import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({
        price: "",
        name: "",
        description: "",
    });
    const router = useRouter();

    async function onChange(e) {
        /* upload image to IPFS */
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
                progress: prog => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }
    async function uploadToIPFS() {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl) return;
        /* first, upload metadata to IPFS */
        const data = JSON.stringify({
            name,
            description,
            image: fileUrl,
        });
        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
            return url;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    async function listNFTForSale() {
        const url = await uploadToIPFS();

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        /* create the NFT */
        const price = ethers.utils.parseUnits(formInput.price, "ether");
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        let transaction = await contract.createToken(url, price, {
            value: listingPrice,
        });
        await transaction.wait();

        router.push("/");
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
                    {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
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
