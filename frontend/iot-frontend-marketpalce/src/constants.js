// import DeviceRegistryArtifact from '../../../artifacts/contracts/DeviceRegistry.sol/DeviceRegistry.json';
// import DataPublisherArtifact from '../../../artifacts/contracts/DataPublisher.sol/DataPublisher.json';
// import MarketplaceArtifact from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json';

import DeviceRegistryArtifact from './abis/DeviceRegistry.json';
import DataPublisherArtifact from './abis/DataPublisher.json';
import MarketplaceArtifact from './abis/Marketplace.json';

export const DEVICE_REGISTRY_ADDRESS = "0x26F08771d413C68bbdefb733dd8fC25d07Dad1d2";
export const DEVICE_REGISTRY_ABI = DeviceRegistryArtifact.abi;

export const DATA_PUBLISHER_ADDRESS = "0x4227aB33D1bfdb8FBd850B26cd91BF038902873c";
export const DATA_PUBLISHER_ABI = DataPublisherArtifact.abi;

export const MARKETPLACE_ADDRESS = "0xB9038ad931dBe521F22876894956437170D02042";
export const MARKETPLACE_ABI = MarketplaceArtifact.abi;