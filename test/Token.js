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
  }

  // ====================
  // Deployment Tests
  // ====================
  describe("Deployment", function () {
    /**
     * Test to ensure that the total supply of tokens
     * is assigned to the owner's balance after deployment.
     */
    it("should assign the total supply of tokens to the owner", async function () {
      await deployToken();
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(await hardhatToken.totalSupply());
    });

    it("should set the right owner", async function () {
      await deployToken();
      const actual_owner = await hardhatToken.owner();
      expect(actual_owner).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {

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