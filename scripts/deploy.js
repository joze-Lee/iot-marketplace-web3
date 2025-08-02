// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    // Deploy DeviceRegistry (if still needed)
    const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
    const deviceRegistry = await DeviceRegistry.deploy();
    await deviceRegistry.waitForDeployment();
    const deviceRegistryAddress = await deviceRegistry.getAddress();
    console.log("DeviceRegistry deployed to:", deviceRegistryAddress);
  
    // Deploy DataPublisher
    const DataPublisher = await ethers.getContractFactory("DataPublisher");
    const dataPublisher = await DataPublisher.deploy();
    await dataPublisher.waitForDeployment();
    const dataPublisherAddress = await dataPublisher.getAddress();
    console.log("DataPublisher deployed to:", dataPublisherAddress);
  
    // Deploy Marketplace, pass DataPublisher's address to constructor
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(dataPublisherAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("Marketplace deployed to:", marketplaceAddress);
  }

  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  