import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../config";
import OnomaContract from "../OnomaContract.json";

export default function Admin() {
    async function withdraw() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(marketplaceAddress, OnomaContract.abi, signer);
        const transaction = await contract.withdraw();
    }
    return (
        <button className="h-screen" onClick={withdraw}>
            withdraw
        </button>
    );
}
