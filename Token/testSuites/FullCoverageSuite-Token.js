const { expect } = require("chai");

describe("Token contract", function () {
  let owner, addr1, addr2;
  let hardhatToken;

  /**
   * Helper function to deploy the Token contract
   * and set up test signers.
   */
  async function deployToken() {
    [owner, addr1, addr2] = await ethers.getSigners();
    hardhatToken = await ethers.deployContract("Token");
    await hardhatToken.waitForDeployment();
  }

  // ====================
  // Deployment Tests
  // ====================
  describe("Deployment", function () {

    it("Should mint exactly 1,000,000 tokens on deployment", async function () {
      await deployToken();

      const expectedTotalSupply = 1_000_000n; // raw integer supply
      expect(await hardhatToken.totalSupply()).to.equal(expectedTotalSupply);
    });

    /**
     * Test to ensure that the total supply of tokens
     * is assigned to the owner's balance after deployment.
     */
    it("Should assign the total supply of tokens to the owner", async function () {
      await deployToken();
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  // ====================
  // Transaction Tests
  // ====================
  describe("Transactions", function () {
    /**
     * Test token transfer from owner to another account,
     * followed by a transfer between non-owner accounts.
     */
    it("Should transfer tokens between accounts", async function () {
      await deployToken();

      // Owner transfers 30 tokens to addr1
      await expect(
        hardhatToken.transfer(addr1.address, 30)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-30, 30]);

      // addr1 transfers 30 tokens to addr2
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 30)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-30, 30]);
    });

    /**
     * Test that transfers fail if the sender does not have
     * a sufficient token balance.
     */
    it("Should fail if sender doesn't have enough tokens", async function () {
      await deployToken();

      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Attempt to transfer from addr1, which has 0 tokens
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Ensure owner's balance hasn't changed
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
