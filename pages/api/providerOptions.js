import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
    metamask: {},
    walletlink: {
        package: CoinbaseWalletSDK, // Required
        options: {
            appName: "Web 3 Modal Demo", // Required
            infuraId: "aa4f0c8f6fc34ec882b6912863c090c0", // Required unless you provide a JSON RPC url; see `rpc` below
        },
    },
    walletconnect: {
        package: WalletConnect, // required
        options: {
            infuraId: "aa4f0c8f6fc34ec882b6912863c090c0", // required
        },
    },
};
