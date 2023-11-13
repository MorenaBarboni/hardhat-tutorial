// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
    // We define a fixture to reuse the same setup in every test. We use
    // loadFixture to run this setup once, snapshot that state, and reset Hardhat
    // Network to that snapshot in every test.

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        it("Should assign the total supply of tokens to the owner", async function () {
            //Write your test here
            
        });
    });

});