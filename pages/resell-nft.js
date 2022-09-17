import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";

export default function ResellNFT() {
    const [formInput, updateFormInput] = useState({ price: "", image: "" });
    const router = useRouter();
    const { id, uri, seller } = router.query;
    const { image, price } = formInput;

    useEffect(() => {}, []);

    // useEffect(() => {
    //     fetchNFT();
    // }, [id]);

    // async function fetchNFT() {
    //     if (!tokenURI) return;
    //     const meta = await axios.get(tokenURI);
    //     console.log(meta.data);
    //     updateFormInput(state => ({ ...state, image: meta.data.image }));
    // }

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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const buyprice = ethers.utils.parseUnits(price.toString(), "ether");
            const signature = await createVoucher(id, uri, buyprice, signer);
            console.log(signature);
            if (signature) {
                await axios.patch("http://localhost:8080/update/resell", {
                    tokenID: id,
                    owner: marketplaceAddress,
                    price: price,
                    seller: seller,
                    signature: signature,
                });
            } else {
                router.push("/my-nfts");
            }
        } catch (err) {
            console.error(err);
        }

        router.push("/");
    }

    return (
        <div className="flex justify-center h-screen">
            <div className="w-1/2 h-3/5 flex flex-col justify-around outline outline-onomablue outline-2 rounded mt-12">
                {image && <img className="rounded mt-4 self-center" width="350" src={image} />}
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4 w-1/2 self-center text-black"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <button
                    onClick={listNFTForSale}
                    className="bg-onomapurple text-white font-bold rounded p-3 m-6 w-1/5 self-center"
                >
                    List NFT
                </button>
            </div>
        </div>
    );
}
