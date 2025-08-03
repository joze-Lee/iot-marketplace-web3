// import DeviceRegistryArtifact from '../../../artifacts/contracts/DeviceRegistry.sol/DeviceRegistry.json';
// import DataPublisherArtifact from '../../../artifacts/contracts/DataPublisher.sol/DataPublisher.json';
// import MarketplaceArtifact from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json';

import DeviceRegistryArtifact from './abis/DeviceRegistry.json';
import DataPublisherArtifact from './abis/DataPublisher.json';
import MarketplaceArtifact from './abis/Marketplace.json';

export const DEVICE_REGISTRY_ADDRESS = "0x1B5ca695e3df1498a7d77B75c051125F403fdfB6";
export const DEVICE_REGISTRY_ABI = DeviceRegistryArtifact.abi;

export const DATA_PUBLISHER_ADDRESS = "0x1C957b7c1745A3D9ad429EFF34CFD7d4949Ac231";
export const DATA_PUBLISHER_ABI = DataPublisherArtifact.abi;

export const MARKETPLACE_ADDRESS = "0xD2646a6eDF70b9276790d5a2EE11fECaFD56675B";
export const MARKETPLACE_ABI = MarketplaceArtifact.abi;