/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter");

module.exports = {
  solidity: "0.8.19",
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    language: "json"
  }
};
