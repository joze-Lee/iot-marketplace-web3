// import DeviceRegistryArtifact from '../../../artifacts/contracts/DeviceRegistry.sol/DeviceRegistry.json';
// import DataPublisherArtifact from '../../../artifacts/contracts/DataPublisher.sol/DataPublisher.json';
// import MarketplaceArtifact from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json';

import DeviceRegistryArtifact from './abis/DeviceRegistry.json';
import DataPublisherArtifact from './abis/DataPublisher.json';
import MarketplaceArtifact from './abis/Marketplace.json';


export const DEVICE_REGISTRY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const DEVICE_REGISTRY_ABI = DeviceRegistryArtifact.abi;

export const DATA_PUBLISHER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const DATA_PUBLISHER_ABI = DataPublisherArtifact.abi;

export const MARKETPLACE_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const MARKETPLACE_ABI = MarketplaceArtifact.abi;