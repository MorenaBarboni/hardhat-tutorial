const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("CampusCoin", function () {
  let campusCoin;
  let admin, university, student1, student2, provider;

  before(async () => {
    [admin, university, student1, student2, provider] = await ethers.getSigners();
    const CampusCoin = await ethers.getContractFactory("CampusCoin");
    campusCoin = await CampusCoin.deploy(university.address);
    await campusCoin.waitForDeployment();
  });

  describe("Deployment", () => {

   
  });

  describe("Student management", () => {

  });

  describe("Token minting & burning", () => {
   
  });

  describe("Transfers", () => {
   
  });

  describe("Service Provider management", () => {

    
  });

  describe("Service Payments", () => {
   
  });
});
