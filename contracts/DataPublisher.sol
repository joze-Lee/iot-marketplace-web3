// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataPublisher {
    struct DataEntry {
        uint256 id;
        address publisher;
        string dataHash;
        string deviceId;
        string description;
        uint256 timestamp;
        bool isAvailable;
    }

    uint256 private nextDataId = 1;
    mapping(uint256 => DataEntry) private dataEntries;
    mapping(address => uint256[]) private publisherToDataIds;

    event DataPublished(
        uint256 indexed id,
        address indexed publisher,
        string dataHash,
        string description
    );
    event DataRemoved(uint256 indexed id);
    event DataUpdated(uint256 indexed id, string newDescription);

    modifier onlyPublisher(uint256 dataId) {
        require(dataEntries[dataId].publisher == msg.sender, "Not authorized");
        _;
    }

    function publishData(
        string memory dataHash,
        string memory description,
        string memory deviceId
    ) external {
        require(bytes(dataHash).length > 0, "Data hash cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(deviceId).length > 0, "Device ID required");

        uint256 currentId = nextDataId;
        dataEntries[currentId] = DataEntry({
            id: currentId,
            publisher: msg.sender,
            dataHash: dataHash,
            description: description,
            deviceId: deviceId,
            timestamp: block.timestamp,
            isAvailable: true
        });

        publisherToDataIds[msg.sender].push(currentId);
        emit DataPublished(currentId, msg.sender, dataHash, description);
        nextDataId++;
    }

    function getDataEntry(
        uint256 dataId
    ) external view returns (DataEntry memory) {
        require(dataEntries[dataId].isAvailable, "Data not available");
        return dataEntries[dataId];
    }
    function getDeviceIdByDataId(
        uint256 dataId
    ) external view returns (string memory) {
        require(dataEntries[dataId].isAvailable, "Data not available");
        return dataEntries[dataId].deviceId;
    }

    function getMyPublishedData() external view returns (uint256[] memory) {
        return publisherToDataIds[msg.sender];
    }
    function getDataCount() external view returns (uint256) {
        return nextDataId - 1;
        // return 1;
    }
    function removeData(uint256 dataId) external onlyPublisher(dataId) {
        require(dataEntries[dataId].isAvailable, "Data already removed");

        dataEntries[dataId].isAvailable = false;
        emit DataRemoved(dataId);
    }

    function updateDescription(
        uint256 dataId,
        string memory newDescription
    ) external onlyPublisher(dataId) {
        require(dataEntries[dataId].isAvailable, "Data not available");
        require(
            bytes(newDescription).length > 0,
            "Description cannot be empty"
        );

        dataEntries[dataId].description = newDescription;
        emit DataUpdated(dataId, newDescription);
    }

    function totalPublishedCount() external view returns (uint256) {
        return nextDataId - 1;
    }
}
