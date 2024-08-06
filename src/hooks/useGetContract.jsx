import { ethers } from 'ethers';
import { useEffect, useState } from "react";

// Load environment variables
const anvilUrl = import.meta.env.VITE_RPC_URL;
const privateKey = import.meta.env.VITE_PRIVATE_KEY;
const NodeManagerContractAddress = import.meta.env.VITE_NODEMANAGER_CONTRACT_ADDRESS;
const ConsensusMechanismContractAddress = import.meta.env.VITE_CONSENSUS_CONTRACT_ADDRESS;

// Initialize the provider and wallet
const provider = new ethers.JsonRpcProvider(anvilUrl);
const wallet = new ethers.Wallet(privateKey, provider);

const NodeManagerABI = [{
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "DEFAULT_ADMIN_ROLE",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getNodeAddresses",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getRoleAdmin",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "grantRole",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "account",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "hasRole",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "account",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "initialize",
    "inputs": [{
        "name": "_nodeAddresses",
        "type": "address[]",
        "internalType": "address[]"
    }, {
        "name": "_currentPosition",
        "type": "uint8[]",
        "internalType": "enum DataTypes.NodeRegion[]"
    }, { "name": "IPFS", "type": "string[]", "internalType": "string[]" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "isNodeRegistered",
    "inputs": [{ "name": "nodeAddress", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "numberOfPresentNodes",
    "inputs": [],
    "outputs": [{ "name": "count", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "registerNewNode",
    "inputs": [{
        "name": "_nodeAddress",
        "type": "address",
        "internalType": "address"
    }, {
        "name": "_currentPosition",
        "type": "uint8",
        "internalType": "enum DataTypes.NodeRegion"
    }, { "name": "IPFS", "type": "string", "internalType": "string" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "renounceRole",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
    }, { "name": "callerConfirmation", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "retrieveAddressByIndex",
    "inputs": [{ "name": "index", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "retrieveAllRegisteredNodeData",
    "inputs": [],
    "outputs": [{
        "name": "",
        "type": "tuple[]",
        "internalType": "struct DataTypes.RegisteredNodes[]",
        "components": [{
            "name": "nodeAddress",
            "type": "address",
            "internalType": "address"
        }, {
            "name": "currentPosition",
            "type": "uint8",
            "internalType": "enum DataTypes.NodeRegion"
        }, { "name": "IPFSData", "type": "string", "internalType": "string" }]
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "retrieveNodeDataByAddress",
    "inputs": [{ "name": "_nodeAddress", "type": "address", "internalType": "address" }],
    "outputs": [{
        "name": "",
        "type": "tuple",
        "internalType": "struct DataTypes.RegisteredNodes",
        "components": [{
            "name": "nodeAddress",
            "type": "address",
            "internalType": "address"
        }, {
            "name": "currentPosition",
            "type": "uint8",
            "internalType": "enum DataTypes.NodeRegion"
        }, { "name": "IPFSData", "type": "string", "internalType": "string" }]
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "retrieveOwner",
    "inputs": [],
    "outputs": [{ "name": "contractOwner", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "revokeRole",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "account",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "updateExpeditionaryForces",
    "inputs": [{
        "name": "expeditionaryForces",
        "type": "uint8",
        "internalType": "enum DataTypes.NodeRegion"
    }, { "name": "_nodeAddress", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "updateNodeIPFSData",
    "inputs": [{
        "name": "_nodeAddress",
        "type": "address",
        "internalType": "address"
    }, { "name": "newIPFS", "type": "string", "internalType": "string" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [{
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
    }, { "name": "data", "type": "bytes", "internalType": "bytes" }],
    "outputs": [],
    "stateMutability": "payable"
}, {
    "type": "event",
    "name": "Initialized",
    "inputs": [{ "name": "version", "type": "uint64", "indexed": false, "internalType": "uint64" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "NodeRegistered",
    "inputs": [{
        "name": "nodeAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "currentPosition",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum DataTypes.NodeRegion"
    }],
    "anonymous": false
}, {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [{
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "RoleAdminChanged",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "previousAdminRole",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, { "name": "newAdminRole", "type": "bytes32", "indexed": true, "internalType": "bytes32" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "RoleGranted",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "RoleRevoked",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "Upgraded",
    "inputs": [{
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }],
    "anonymous": false
}, { "type": "error", "name": "ARRAYS_LENGTH_IS_NOT_EQUAL", "inputs": [] }, {
    "type": "error",
    "name": "AccessControlBadConfirmation",
    "inputs": []
}, {
    "type": "error",
    "name": "AccessControlUnauthorizedAccount",
    "inputs": [{
        "name": "account",
        "type": "address",
        "internalType": "address"
    }, { "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }]
}, {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [{ "name": "target", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [{ "name": "implementation", "type": "address", "internalType": "address" }]
}, { "type": "error", "name": "ERC1967NonPayable", "inputs": [] }, {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
}, { "type": "error", "name": "InvalidInitialization", "inputs": [] }, {
    "type": "error",
    "name": "NOT_ZERO_ADDRESS_ALLOWED",
    "inputs": []
}, {
    "type": "error",
    "name": "NodeManager__CALLER_IS_NOT_AUTHORIZED",
    "inputs": []
}, { "type": "error", "name": "NodeManager__NODE_ALREADY_EXIST", "inputs": [] }, {
    "type": "error",
    "name": "NodeManager__NODE_NOT_FOUND",
    "inputs": []
}, { "type": "error", "name": "NotInitializing", "inputs": [] }, {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }]
}, { "type": "error", "name": "UUPSUnauthorizedCallContext", "inputs": [] }, {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [{ "name": "slot", "type": "bytes32", "internalType": "bytes32" }]
}]
const ConsensusMechanismABI = [{
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "DEFAULT_ADMIN_ROLE",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "POLICY_CUSTODIAN",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "TargetLocationSimulation",
    "inputs": [{
        "name": "agents",
        "type": "address[]",
        "internalType": "address[]"
    }, {
        "name": "announceTargets",
        "type": "uint8[]",
        "internalType": "enum DataTypes.TargetZone[]"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "checkUpkeep",
    "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
    "outputs": [{ "name": "upkeepNeeded", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "consensusAutomationExecution",
    "inputs": [],
    "outputs": [{ "name": "isReached", "type": "bool", "internalType": "bool" }, {
        "name": "target",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "fetchConsensusEpochTimeDuration",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchConsensusThreshold",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint64", "internalType": "uint64" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchEpochConsensusZones",
    "inputs": [{ "name": "epochCounter", "type": "uint128", "internalType": "uint128" }],
    "outputs": [{
        "name": "nodes",
        "type": "address[]",
        "internalType": "address[]"
    }, { "name": "zones", "type": "uint8[]", "internalType": "enum DataTypes.TargetZone[]" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchNodeMangerProxyContractAddress",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchNumberOfEpoch",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchPolicyCustodian",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchResultOfEachEpoch",
    "inputs": [{ "name": "epoch", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchStartTime",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "fetchTargetLocation",
    "inputs": [{ "name": "agent", "type": "address", "internalType": "address" }],
    "outputs": [{
        "name": "",
        "type": "tuple",
        "internalType": "struct DataTypes.TargetLocation",
        "components": [{
            "name": "zone",
            "type": "uint8",
            "internalType": "enum DataTypes.TargetZone"
        }, {
            "name": "reportedBy",
            "type": "address",
            "internalType": "address"
        }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }, {
            "name": "isActive",
            "type": "bool",
            "internalType": "bool"
        }]
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "getRoleAdmin",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "grantRole",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "account",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "hasNodeParticipated",
    "inputs": [{ "name": "agent", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "hasRole",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "account",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "initialize",
    "inputs": [{
        "name": "_s_consensusThreshold",
        "type": "uint8",
        "internalType": "uint8"
    }, {
        "name": "nodeManagerContractAddress",
        "type": "address",
        "internalType": "address"
    }, { "name": "policyCustodian", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "isEpochNotStarted",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "modifyConsensusThreshold",
    "inputs": [{ "name": "newThreshold", "type": "uint64", "internalType": "uint64" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "modifyEpochDuration",
    "inputs": [{
        "name": "newEpochTimeDurationInMinute",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "performUpkeep",
    "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "renounceRole",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
    }, { "name": "callerConfirmation", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "reportTargetLocation",
    "inputs": [{
        "name": "agent",
        "type": "address",
        "internalType": "address"
    }, { "name": "announceTarget", "type": "uint8", "internalType": "enum DataTypes.TargetZone" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "revokeRole",
    "inputs": [{ "name": "role", "type": "bytes32", "internalType": "bytes32" }, {
        "name": "account",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "s_lastTimeStamp",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [{
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
    }, { "name": "data", "type": "bytes", "internalType": "bytes" }],
    "outputs": [],
    "stateMutability": "payable"
}, {
    "type": "event",
    "name": "ConsensusExecuted",
    "inputs": [{
        "name": "isReached",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
    }, {
        "name": "target",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
    }, { "name": "epochCounter", "type": "uint256", "indexed": false, "internalType": "uint256" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "ConsensusThresholdModified",
    "inputs": [{
        "name": "previousThreshold",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
    }, { "name": "newThreshold", "type": "uint64", "indexed": false, "internalType": "uint64" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "EpochStatusUpdated",
    "inputs": [{
        "name": "startTime",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
    }, { "name": "epochStatus", "type": "bool", "indexed": false, "internalType": "bool" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "Initialized",
    "inputs": [{ "name": "version", "type": "uint64", "indexed": false, "internalType": "uint64" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [{
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "RoleAdminChanged",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "previousAdminRole",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, { "name": "newAdminRole", "type": "bytes32", "indexed": true, "internalType": "bytes32" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "RoleGranted",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "RoleRevoked",
    "inputs": [{
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, { "name": "sender", "type": "address", "indexed": true, "internalType": "address" }],
    "anonymous": false
}, {
    "type": "event",
    "name": "TargetLocationReported",
    "inputs": [{
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "announceTarget",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum DataTypes.TargetZone"
    }],
    "anonymous": false
}, {
    "type": "event",
    "name": "TargetLocationSimulated",
    "inputs": [{
        "name": "agent",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "announceTarget",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum DataTypes.TargetZone"
    }],
    "anonymous": false
}, {
    "type": "event",
    "name": "Upgraded",
    "inputs": [{
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }],
    "anonymous": false
}, { "type": "error", "name": "ARRAYS_LENGTH_IS_NOT_EQUAL", "inputs": [] }, {
    "type": "error",
    "name": "AccessControlBadConfirmation",
    "inputs": []
}, {
    "type": "error",
    "name": "AccessControlUnauthorizedAccount",
    "inputs": [{
        "name": "account",
        "type": "address",
        "internalType": "address"
    }, { "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }]
}, {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [{ "name": "target", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "ConsensusMechanism__NODE_ALREADY_VOTED",
    "inputs": []
}, {
    "type": "error",
    "name": "ConsensusMechanism__NODE_NOT_REGISTERED",
    "inputs": []
}, {
    "type": "error",
    "name": "ConsensusMechanism__ONLY_POLICY_CUSTODIAN",
    "inputs": []
}, {
    "type": "error",
    "name": "ConsensusMechanism__THRESHOLD_EXCEEDS_NODES",
    "inputs": []
}, {
    "type": "error",
    "name": "ConsensusMechanism__TIME_IS_NOT_REACHED",
    "inputs": []
}, {
    "type": "error",
    "name": "ConsensusMechanism__VOTING_IS_INPROGRESS",
    "inputs": []
}, {
    "type": "error",
    "name": "ConsensusMechanism__YOU_ARE_NOT_CORRECT_SENDER",
    "inputs": []
}, {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [{ "name": "implementation", "type": "address", "internalType": "address" }]
}, { "type": "error", "name": "ERC1967NonPayable", "inputs": [] }, {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
}, { "type": "error", "name": "InvalidInitialization", "inputs": [] }, {
    "type": "error",
    "name": "NodeManager__CALLER_IS_NOT_AUTHORIZED",
    "inputs": []
}, { "type": "error", "name": "NotInitializing", "inputs": [] }, {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }]
}, {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [{ "name": "account", "type": "address", "internalType": "address" }]
}, { "type": "error", "name": "UUPSUnauthorizedCallContext", "inputs": [] }, {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [{ "name": "slot", "type": "bytes32", "internalType": "bytes32" }]
}]
// console.log('ABI:', NodeManagerABI);
// console.log('ABI:', ConsensusMechanismABI);

// Create a contract instance
const NodeManagerContract = new ethers.Contract(NodeManagerContractAddress, NodeManagerABI, wallet);
const ConsensusMechanismContract = new ethers.Contract(ConsensusMechanismContractAddress, ConsensusMechanismABI, wallet);

const s_agents = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];
const s_announceTargets = ["1"];

export const useInteractWithNodeManagerContract = () => {

    const [result, setResult] = useState()
    const [error, setError] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await NodeManagerContract.retrieveAllRegisteredNodeData();
                const structuredData = data.map((nodeData, index) => ({
                    id: index,
                    address: nodeData.nodeAddress,
                    position: nodeData.currentPosition,
                    ipfsData: nodeData.IPFSData
                }));

                setResult(structuredData);
            } catch (err) {
                setError(err);
                console.error('Error interacting with the contract:', err);
            }
        };

        fetchData();
    }, []);
    return { result, error };
}


export const useInteractWithConsensusContract = (addresses, positions) => {

    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {

            if (addresses.length === 0 || positions.length === 0) return;


            try {
                console.log(addresses)
                console.log(positions)

                const data = await ConsensusMechanismContract.TargetLocationSimulation(addresses, positions);
                // const data = await ConsensusMechanismContract.TargetLocationSimulation(s_agents,s_announceTargets);
                // console.log(data);
                console.log('Transaction sent:', data.hash);
                const receipt = await data.wait();
                console.log('Transaction confirmed in block:', receipt.blockNumber);
            } catch (err) {
                console.error('Error interacting with the contract:', err);
                setError(err);
            }
        };
        fetchData();
    }, [addresses, positions]);

    return { error };
}


