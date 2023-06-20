// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.5.0 <0.9.0;

import "./Ownable.sol";

contract Qualkey is Ownable {

    struct Credential {
        string did;
        bytes32 hash;
        string link;
        uint32 timestamp;
    }

    mapping (uint32 => Credential) private credentials;

    function setCredential(uint32 _id, string memory _did, bytes32 _hash, string memory _link, uint32 _timestamp) public onlyOwner {
        Credential storage credential = credentials[_id];
        credential.did = _did;
        credential.hash = _hash;
        credential.link = _link;
        credential.timestamp = _timestamp;
    }

    function getCredential(uint32 _id) public view returns(string memory, bytes32, string memory, uint32) {
        require(bytes(credentials[_id].did).length != 0);
        return (
        credentials[_id].did,
        credentials[_id].hash,
        credentials[_id].link,
        credentials[_id].timestamp
        );
    }
}
