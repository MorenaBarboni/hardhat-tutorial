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
     * Test to ensure that the total supply of tokens
     * is assigned to the owner's balance after deployment.
     */
    it("Should assign the total supply of tokens to the owner", async function () {
      await deployToken();
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });
});
