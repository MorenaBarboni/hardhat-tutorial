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

  });
});
