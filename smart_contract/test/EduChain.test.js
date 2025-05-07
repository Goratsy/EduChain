const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EduChain", function () {
  let eduChain;
  let owner, university, student;

  before(async () => {
    [owner, university, student] = await ethers.getSigners();

    const EduChain = await ethers.getContractFactory("EduChain");
    eduChain = await EduChain.deploy();
  });

  it("Should add university", async () => {
    await eduChain.addUniversity(university.address);
    expect(await eduChain.universities(university.address)).to.be.true;
  });

  it("Should NOT allow non-owner to add universities", async () => {
    await expect(eduChain.connect(student).addUniversity(student.address))
      .to.be.revertedWith("Only admin can add universities");
  });

  it("Should add achievement (university only)", async () => {
    await eduChain.addUniversity(university.address);
    const tx = eduChain.connect(university).addAchievement("s123", "Math", 95);
    await expect(tx).to.emit(eduChain, "AchievementAdded");
  });

  it("Should NOT allow students to add achievements", async () => {
    await expect(eduChain.connect(student).addAchievement("s123", "Physics", 85))
      .to.be.revertedWith("Only authorized universities can add data");
  });

  it("Should retrieve achievements by studentId", async () => {
    await eduChain.connect(university).addAchievement("s123", "Chemistry", 90);
    const achievements = await eduChain.getAchievementsByStudent("s123");
    expect(achievements.length).to.equal(2);
  });
});