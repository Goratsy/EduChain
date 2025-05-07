async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    const EduChain = await ethers.getContractFactory("EduChain");
    const contract = await EduChain.deploy();
  
    console.log("Contract deployed to:", await contract.getAddress());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });