import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./interact.js";
import { providerOptions } from "./api/providerOptions";

import Web3Modal from "web3modal";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }) {
    const [popupVisible, setPopupVisble] = useState(false);
    const [status, setStatus] = useState("");
    const [account, setAccount] = useState(null);
    const adminWallet = "0x612B9C1860566f0A83F106e893933F86533F6eDe";
    const [provider, setProvider] = useState(null);
    const showPopup = () => setPopupVisble(true);
    const closePopup = () => setPopupVisble(false);
    const [web3Modal, setWeb3Modal] = useState();
    // const disconnectWallet = () => {
    //     // Web3 things...
    //     closePopup();
    // };

    useEffect(() => {
        // const { address, status } = await getCurrentWalletConnected();
        web3Handler();
    }, []);

    const ConnectWalletPopup = () => {
        return (
            <>
                <button onClick={web3Handler}>CONNECT WALLET</button>
            </>
        );
    };

    const connection = function (param) {
        return new Promise((resolve, reject) => {
            if (param) {
                resolve("connected");
            } else {
                reject("not connected");
            }
        });
    };

    async function isUnlocked() {
        let unlocked;
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            unlocked = accounts.length > 0;
        } catch (e) {
            unlocked = false;
        }
        return unlocked;
    }

    // MetaMask Login/Connect
    const web3Handler = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setStatus(true);
                setAccount(accounts[0]);
                closePopup();
            } else {
            }
        } catch (err) {
            console.error(err);
        }
    };
    // function addWalletListener() {
    //     if (window.ethereum) {
    //         window.ethereum.on("accountsChanged", accounts => {
    //             location.reload();
    //             if (accounts.length > 0) {
    //                 setWallet(accounts[0]);
    //                 setStatus("👆🏽 Write a message in the text-field above.");
    //             } else {
    //                 setWallet("");
    //                 setStatus("🦊 Connect to Metamask using the top right button.");
    //             }
    //         });
    //     } else {
    //         setStatus(
    //             <p>
    //                 {" "}
    //                 🦊{" "}
    //                 <a target="_blank" href={`https://metamask.io/download.html`}>
    //                     You must install Metamask, a virtual Ethereum wallet, in your browser.
    //                 </a>
    //             </p>
    //         );
    //     }
    // }

    return (
        <>
            {popupVisible && (
                <div
                    id="walletNotConnectedPopup"
                    style={{
                        width: "20rem",
                        height: "20rem",
                        backgroundColor: "green",
                        position: "absolute",
                        top: 50,
                        left: 50,
                    }}
                >
                    {ConnectWalletPopup()}
                </div>
            )}
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
                                <a className="mr-6 text-xl font-bold text-onomapurple">
                                    My Dashboard
                                </a>
                            </Link>
                            {account === adminWallet.toLowerCase() ? (
                                <Link href="/admin">
                                    <a className="mr-6 text-xl font-bold text-onomapurple">Admin</a>
                                </Link>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    </section>
                    <button
                        className="bg-onomablue w-1/4 rounded-lg text-white text-2xl text-center self-center p-3"
                        onClick={web3Handler}
                    >
                        {account != null ? (
                            "Connected: " +
                            String(account).substring(0, 6) +
                            "..." +
                            String(account).substring(38)
                        ) : (
                            <span>Connect Wallet</span>
                        )}
                    </button>
                </nav>
                {/* <Component {...pageProps, showPopup, closePopup } /> */}
                <Component
                    showPopup={showPopup}
                    isUnlocked={isUnlocked}
                    connection={connection}
                    provider={provider}
                />
                <div className="border-b p-12 flex flex-column justify-between">
                    <a>© Onoma AI, Inc. All rights reserved.</a>
                    <a>sns link</a>
                </div>
            </div>
        </>
    );
}

export default MyApp;
