/* hardhat.config.js */
//require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config({ path: __dirname + "/.env" });
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
    defaultNetwork: "ropsten",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        //  unused configuration commented out for now
        ropsten: {
            url: API_URL,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
