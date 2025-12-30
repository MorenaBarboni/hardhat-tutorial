# HardHat Tutorial

## Token Project Structure

* `./contracts`: Default Contract Folder used by HardHat;
    * `Token.sol`: Smart Contract Under Test (SCUT)
* `./test`: Default Test Folder used by HardHat;
    * `Token.js`: Test File
* `package.json`: Node project metadata;
* `hardhat-config.js`: HardHat configuration File;

## Installing Dependencies
Install the dependencies with `npm install`.

## Compiling the Smart Contract
Compile the contract with `npx hardhat compile`

* You will find the compilation artifacts in `./artifacts`

## Testing the Smart Contract
Run the test suite with `npx hardhat test`

## Checking Coverage
* Check code coverage with `npx hardhat coverage`
* You can inspect the coverage report (`coverage/index.html`) with the `live-server` extension for VSCode

## CampusCoin Project Structure