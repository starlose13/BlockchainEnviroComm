// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {INodeManager} from "../../../interfaces/INodeManager.sol";
import {DataTypes} from "../Helper/DataTypes.sol";
import {Errors} from "../Helper/Errors.sol";
import {OwnableUpgradeable} from "lib/openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {AccessControlUpgradeable} from "lib/openzeppelin-contracts-upgradeable/contracts/access/AccessControlUpgradeable.sol";
import {AddressUpgradeable} from "lib/chainlink-brownie-contracts/contracts/src/v0.8/vendor/openzeppelin-contracts-upgradeable/v4.8.1/utils/AddressUpgradeable.sol";

/**
 * @title NodeManager
 * @author SunAir institue, University of Ferdowsi
 * @dev This contract manages the registration and data of nodes within a decentralized system.
 */
contract NodeManager is
    INodeManager,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    AccessControlUpgradeable
{
    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    bytes32 private UPGRADER_ROLE;

    // Contract Admin who can modify the contract and manage the system
    address private CONTRACT_ADMIN;

    // Array to store all node addresses
    address[] internal s_nodes;

    /*//////////////////////////////////////////////////////////////
                               MAPPINGS
    //////////////////////////////////////////////////////////////*/

    // Mapping to store registered nodes and their data
    mapping(address => DataTypes.RegisteredNodes) private s_registeredNodes;

    // Mapping to check if a node is already registered
    mapping(address => bool) private s_ExistingNodes;

    /*//////////////////////////////////////////////////////////////
                             CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Constructor to initialize the contract with initial nodes.
     * @param _nodeAddresses Array of node addresses to be registered initially.
     * @param _currentPosition Array of node regions corresponding to the addresses.
     * @param IPFS Array of IPFS hashes corresponding to the node data. this IPFS contains the details of
     * the nodes data consisting of the type of weapons and the name of the weapon
     */
    function initialize(
        address[] memory _nodeAddresses,
        DataTypes.NodeRegion[] memory _currentPosition,
        string[] memory IPFS
    ) public initializer {
        if (_nodeAddresses.length != _currentPosition.length) {
            revert Errors.ARRAYS_LENGTH_IS_NOT_EQUAL();
        }
        CONTRACT_ADMIN = msg.sender;
        UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
        __Ownable_init(CONTRACT_ADMIN);
        _initializeNodes(_nodeAddresses, _currentPosition, IPFS);
        __UUPSUpgradeable_init();
    }

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Modifier to restrict functions to only the contract admin.
     */
    modifier onlyContractAdmin() {
        if (msg.sender != CONTRACT_ADMIN) {
            revert Errors.NodeManager__CALLER_IS_NOT_AUTHORIZED();
        }
        _;
    }

    /**
     * @dev Modifier to restrict address(0) call functions.
     */

    modifier notZeroAddress(address sender) {
        if (sender == address(0)) {
            revert Errors.NOT_ZERO_ADDRESS_ALLOWED();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                          INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _authorizeUpgrade(
        address newImplementation
    ) internal view override onlyRole(UPGRADER_ROLE) {
        if (msg.sender != CONTRACT_ADMIN) {
            revert Errors.NodeManager__CALLER_IS_NOT_AUTHORIZED();
        }
        if (!AddressUpgradeable.isContract(newImplementation)) {
            revert Errors.NodeManager__CALLER_IS_NOT_AUTHORIZED();
        }
    }

    /**
     * @dev Internal function to initialize nodes during contract deployment.
     * @param _nodeAddress Array of node addresses to be registered.
     * @param _currentPosition Array of node regions corresponding to the addresses.
     * @param IPFS Array of IPFS hashes corresponding to the node data.
     */

    function _initializeNodes(
        address[] memory _nodeAddress,
        DataTypes.NodeRegion[] memory _currentPosition,
        string[] memory IPFS
    ) internal {
        for (uint256 i = 0; i < _nodeAddress.length; i++) {
            _registerNode(_nodeAddress[i], _currentPosition[i], IPFS[i]);
        }
    }

    /**
     * @dev Internal function to register a node.
     * @param _nodeAddress Address of the node to be registered.
     * @param currentPosition Region of the node.
     * @param IPFS IPFS hash of the node data.
     */

    function _registerNode(
        address _nodeAddress,
        DataTypes.NodeRegion currentPosition,
        string memory IPFS
    ) internal notZeroAddress(_nodeAddress) {
        s_registeredNodes[_nodeAddress] = DataTypes.RegisteredNodes({
            nodeAddress: _nodeAddress,
            currentPosition: currentPosition,
            IPFSData: IPFS
        });
        s_nodes.push(_nodeAddress);
        s_ExistingNodes[_nodeAddress] = true;
        emit NodeRegistered(_nodeAddress, currentPosition);
    }

    /*//////////////////////////////////////////////////////////////
                     PUBLIC & EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Updates the IPFS data of a node.
     * @param _nodeAddress Address of the node to update.
     * @param newIPFS New IPFS data.
     */
    function updateNodeIPFSData(
        address _nodeAddress,
        string memory newIPFS
    ) external onlyContractAdmin notZeroAddress(_nodeAddress) {
        if (!isNodeRegistered(_nodeAddress)) {
            revert Errors.NodeManager__NODE_NOT_FOUND();
        }
        s_registeredNodes[_nodeAddress].IPFSData = newIPFS;
    }

    /**
     * @dev Registers a new node if it's not already registered.
     * @param _nodeAddress Address of the new node.
     * @param _currentPosition Position of the new node.
     * @param IPFS IPFS data of the new node.
     */

    function registerNewNode(
        address _nodeAddress,
        DataTypes.NodeRegion _currentPosition,
        string memory IPFS
    ) external onlyContractAdmin {
        if (isNodeRegistered(_nodeAddress)) {
            revert Errors.NodeManager__NODE_ALREADY_EXIST();
        }
        _registerNode(_nodeAddress, _currentPosition, IPFS);
        emit NodeRegistered(_nodeAddress, _currentPosition);
    }

    /**
     * @dev Updates the position of a node.
     * @param expeditionaryForces New position of the node.
     * @param _nodeAddress Address of the node to update.
     */

    function updateExpeditionaryForces(
        DataTypes.NodeRegion expeditionaryForces,
        address _nodeAddress
    ) external onlyContractAdmin notZeroAddress(_nodeAddress) {
        s_registeredNodes[_nodeAddress].currentPosition = expeditionaryForces;
    }

    /*//////////////////////////////////////////////////////////////
                               GETTERS
    //////////////////////////////////////////////////////////////*/
    /**
     * @dev Checks if a node is already registered.
     * @param nodeAddress Address of the node to check.
     * @return Boolean indicating if the node is registered.
     */

    function isNodeRegistered(address nodeAddress) public view returns (bool) {
        if (s_ExistingNodes[nodeAddress] == true) {
            return true;
        }
        return false;
    }

    /**
     * @dev Returns the number of registered nodes.
     * @return count Count of registered nodes.
     */

    function numberOfPresentNodes() external view returns (uint256 count) {
        return count = s_nodes.length;
    }

    /**
     * @dev Retrieves a node address by its index.
     * @param index Index of the node address to retrieve.
     * @return Address of the node.
     */
    function retrieveAddressByIndex(
        uint256 index
    ) external view returns (address) {
        return s_nodes[index];
    }

    /**
     * @dev Retrieves node data by its address.
     * @param _nodeAddress Address of the node to retrieve data for.
     * @return RegisteredNodes struct containing node data.
     */

    function retrieveNodeDataByAddress(
        address _nodeAddress
    ) external view returns (DataTypes.RegisteredNodes memory) {
        if (!isNodeRegistered(_nodeAddress)) {
            revert Errors.NodeManager__NODE_NOT_FOUND();
        }
        return s_registeredNodes[_nodeAddress];
    }

    /**
     * @dev Retrieves data of all registered nodes.
     * @return Array of RegisteredNodes structs.
     */
    function retrieveAllRegisteredNodeData()
        external
        view
        returns (DataTypes.RegisteredNodes[] memory)
    {
        DataTypes.RegisteredNodes[]
            memory result = new DataTypes.RegisteredNodes[](s_nodes.length);
        for (uint256 i; i < s_nodes.length; i++) {
            result[i] = s_registeredNodes[s_nodes[i]];
        }
        return result;
    }

    function retrieveOwner() external view returns (address contractOwner) {
        return CONTRACT_ADMIN;
    }

    function getNodeAddresses() external view returns (address[] memory) {
        return s_nodes;
    }
}
