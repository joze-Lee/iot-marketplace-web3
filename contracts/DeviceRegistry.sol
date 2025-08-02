// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Device Registry Contract
/// @author Tony
/// @notice Allows registration and metadata update of IoT devices
contract DeviceRegistry {
    struct Device {
        string name;
        string location;
        address owner;
        string metadataURI; // Optional: IPFS or cloud URI for extended metadata
        uint256 registeredAt;
        bool exists;
    }

    // Mapping from unique deviceId to device details
    mapping(string => Device) private devices;

    // List of all device IDs for enumeration
    string[] private deviceIds;

    // Events for frontend DApp
    event DeviceRegistered(
        string indexed deviceId, 
        address indexed owner, 
        string name, 
        string location, 
        string metadataURI
    );

    event DeviceMetadataUpdated(
        string indexed deviceId, 
        string newMetadataURI
    );

    /// @notice Register a new device with deviceId, name, location, and metadataURI
    /// @param deviceId Unique identifier for the device
    /// @param name Name of the device
    /// @param location Physical location of the device
    /// @param metadataURI Optional URI pointing to additional metadata
    function registerDevice(
        string calldata deviceId,
        string calldata name,
        string calldata location,
        string calldata metadataURI
    ) external {
        require(!devices[deviceId].exists, "Device already registered");
        require(bytes(deviceId).length > 0, "Device ID required");
        require(bytes(name).length > 0, "Name required");
        require(bytes(location).length > 0, "Location required");

        devices[deviceId] = Device({
            name: name,
            location: location,
            owner: msg.sender,
            metadataURI: metadataURI,
            registeredAt: block.timestamp,
            exists: true
        });

        deviceIds.push(deviceId);

        emit DeviceRegistered(deviceId, msg.sender, name, location, metadataURI);
    }

    /// @notice Update the metadata URI of a registered device (only by owner)
    /// @param deviceId Unique identifier for the device
    /// @param newMetadataURI New metadata URI to update
    function updateMetadata(string calldata deviceId, string calldata newMetadataURI) external {
        require(devices[deviceId].exists, "Device not registered");
        require(msg.sender == devices[deviceId].owner, "Not the device owner");

        devices[deviceId].metadataURI = newMetadataURI;

        emit DeviceMetadataUpdated(deviceId, newMetadataURI);
    }

    /// @notice Retrieve device details by deviceId
    /// @param deviceId Unique identifier for the device
    /// @return name Device name
    /// @return location Device location
    /// @return owner Owner address
    /// @return metadataURI Metadata URI
    /// @return registeredAt Timestamp of registration
    function getDevice(string calldata deviceId)
        external
        view
        returns (
            string memory name,
            string memory location,
            address owner,
            string memory metadataURI,
            uint256 registeredAt
        )
    {
        require(devices[deviceId].exists, "Device not registered");
        Device storage device = devices[deviceId];
        return (device.name, device.location, device.owner, device.metadataURI, device.registeredAt);
    }

    /// @notice Check if a deviceId is registered
    /// @param deviceId Unique identifier for the device
    /// @return True if device exists, false otherwise
    function isRegistered(string calldata deviceId) external view returns (bool) {
        return devices[deviceId].exists;
    }

    /// @notice Get all registered device IDs
    /// @return Array of device IDs
    function getAllDeviceIds() external view returns (string[] memory) {
        return deviceIds;
    }
}

