const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {
    // We define a fixture to reuse the same setup in every test. We use
    // loadFixture to run this setup once, snapshot that state, and reset Hardhat
    // Network to that snapshot in every test.
    async function deployTokenFixture() {
        // Get the Signers here.
        const [owner, addr1, addr2] = await ethers.getSigners();

        // To deploy our contract, we just have to call ethers.deployContract and await
        // its waitForDeployment() method, which happens once its transaction has been
        // mined.
        const hardhatToken = await ethers.deployContract("Token");

        await hardhatToken.waitForDeployment();

        // Fixtures can return anything you consider useful for your tests
        return { hardhatToken, owner, addr1, addr2 };
    }


    describe("Deployment", function () {

        /**
         * Test to ensure that the total supply of tokens is 1_000_000
         */
        it("Should mint exactly 1,000,000 tokens on deployment", async function () {
            await deployToken();
            const totalSupply = await hardhatToken.totalSupply(); // actual supply
            const expectedTotalSupply = 1_000_000n; // raw integer supply

            expect(totalSupply).to.equal(expectedTotalSupply);
        });

        it("Should set the right owner", async function () {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        /**
         * Test to ensure that the total supply of tokens
         * is assigned to the owner's balance after deployment.
         */
        it("Should assign the total supply of tokens to the owner", async function () {
            await deployToken();
            const ownerAddress = owner.address;
            const ownerBalance = await hardhatToken.balanceOf(ownerAddress); //owner balance
            const totalSupply = await hardhatToken.totalSupply(); // actual supply
            expect(ownerBalance).to.equal(totalSupply);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            // Transfer 50 tokens from owner to addr1
            await expect(
                hardhatToken.transfer(addr1.address, 30)
            ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-30, 30]);

            // Initialize addr2 with some tokens
            await hardhatToken.transfer(addr2.address, 10); // Adjust the amount based on your needs

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(
                hardhatToken.connect(addr1).transfer(addr2.address, 30)
            ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-30, 30]);

            // Check that addr2 received the correct amount
            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(40); // Adjust this based on your token's precision and amount
        });

        it("Should emit Transfer events", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            // Transfer 50 tokens from owner to addr1
            await expect(hardhatToken.transfer(addr1.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(owner.address, addr1.address, 50);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            /*await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
              .to.emit(hardhatToken, "Transfer")
              .withArgs(addr1.address, addr2.address, 50);*/
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const { hardhatToken, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner.
            // `require` will evaluate false and revert the transaction.
            await expect(
                hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens");

            // Owner balance shouldn't have changed.
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });
    });
});