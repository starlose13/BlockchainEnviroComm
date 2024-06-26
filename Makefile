-include .env

# Define network arguments for each network
HOLESKY_NETWORK_ARGS := --rpc-url $(HOLESKY_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) 
FANTOM_NETWORK_ARGS := --rpc-url $(FANTOM_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv --verify --etherscan-api-key $(FANTOMSCAN_API_KEY) 
AMOY_NETWORK_ARGS := --rpc-url $(AMOY_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv --verify --etherscan-api-key $(ETHERSCAN_API_KEY) 

# Default network
NETWORK_ARGS := $(HOLESKY_NETWORK_ARGS)

# Print the value of ARGS for debugging
$(info ARGS: $(ARGS))

# Determine the network arguments based on the ARGS variable
ifeq ($(ARGS),--network fantom)
    NETWORK_ARGS := $(FANTOM_NETWORK_ARGS)
else ifeq ($(ARGS),--network holesky)
    NETWORK_ARGS := $(HOLESKY_NETWORK_ARGS)
else ifeq ($(ARGS),--network amoy)
    NETWORK_ARGS := $(AMOY_NETWORK_ARGS)
endif

# Print the value of NETWORK_ARGS for debugging
$(info NETWORK_ARGS: $(NETWORK_ARGS))


#deploy  the node manager smart contract on the specefic network 

deploy:
	@forge script ./script/NodeManagerScript.s.sol:NodeManagerScript  $(NETWORK_ARGS)


