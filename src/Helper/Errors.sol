// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

/**
 * @title Errors
 * @dev Defines custom error messages used in the contracts.
 */
library Errors {
    error NodeManager__CALLER_IS_NOT_AUTHORIZED(); // 'The caller of the function is not a commander that can manuplate the mission'
    error ConsensusMechanism__NODE_ALREADY_VOTED();
    error ConsensusMechanism__NODE_NOT_REGISTERED();
    error NodeManager__ARRAYS_LENGTH_IS_NOT_EQUAL();
    error NodeManager__NODE_ALREADY_EXIST();
    error ConsensusMechanism__YOU_ARE_NOT_CORRECT_SENDER();
    error ConsensusMechanism__ONLY_POLICY_CUSTODIAN();
    error ConsensusMechanism__THRESHOLD_EXCEEDS_NODES();
    error ConsensusMechanism__VOTING_IS_INPROGRESS();
    error NodeManager__NODE_NOT_FOUND();
}
