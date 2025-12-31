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

    /**
    * Test to ensure that the total supply of tokens is 1_000_000
    */
    it("Should mint exactly 1,000,000 tokens on deployment", async function () {
      await deployToken();
      const totalSupply = await hardhatToken.totalSupply(); // actual supply
      const expectedTotalSupply = 1_000_000n; // raw integer supply

      expect(totalSupply).to.equal(expectedTotalSupply);
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
  });
});
