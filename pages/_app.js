import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./interact.js";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }) {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const adminWallet = "0x612B9C1860566f0A83F106e893933F86533F6eDe";

    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address);
        setStatus(status);
        addWalletListener();
    }, []);

    const connectWalletPressed = async () => {
        const web3Modal = new Web3Modal();
        if (!walletAddress) {
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const walletResponse = await connectWallet();
            setStatus(walletResponse.status);
            setWallet(walletResponse.address);
        }
    };

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", accounts => {
                location.reload();
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            );
        }
    }

    return (
        <div className="bg-black text-onomablue">
            <nav className="border-b p-6 flex flex-column justify-between">
                <section>
                    <p className="text-5xl font-bold text-onoma">OnomaAI Marketplace</p>
                    <div className="flex mt-4">
                        <Link href="/">
                            <a className="mr-4 text-xl font-bold text-onomapurple">Buy NFT</a>
                        </Link>
                        <Link href="/create-nft">
                            <a className="mr-6 text-xl font-bold text-onomapurple">Sell NFT</a>
                        </Link>
                        <Link href="/my-nfts">
                            <a className="mr-6 text-xl font-bold text-onomapurple">My NFTs</a>
                        </Link>
                        <Link href="/dashboard">
                            <a className="mr-6 text-xl font-bold text-onomapurple">My Dashboard</a>
                        </Link>
                        {walletAddress === adminWallet.toLowerCase() ? (
                            <Link href="/admin">
                                <a className="mr-6 text-xl font-bold text-onomapurple">Admin</a>
                            </Link>
                        ) : (
                            <span></span>
                        )}
                    </div>
                </section>
                <button
                    class="bg-onomablue w-1/4 rounded-lg text-white text-2xl text-center self-center p-3"
                    onClick={connectWalletPressed}
                >
                    {walletAddress.length > 0 ? (
                        "Connected: " +
                        String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)
                    ) : (
                        <span>Connect Wallet</span>
                    )}
                </button>
            </nav>
            <Component {...pageProps} />
            <div className="border-b p-12 flex flex-column justify-between">
                © Onoma AI, Inc. All rights reserved.
            </div>
        </div>
    );
}

export default MyApp;
