// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collectible is ERC721 {
    address immutable _trustedForwarder;
    uint256 internal nextTokenId = 1;

    constructor(address trustedForwarder) ERC721("Collectible", "$CLB") {
        _trustedForwarder = trustedForwarder;
    }

    function mintNFT() public {
        address sender = _msgSender();
        _safeMint(sender, nextTokenId);
        nextTokenId += 1;
    }

    function isTrustedForwarder(address forwarder) public view returns (bool) {
        return forwarder == _trustedForwarder;
    }

    function _msgSender() internal view override returns (address signer) {
        signer = msg.sender;
        if (msg.data.length >= 20 && isTrustedForwarder(signer)) {
            assembly {
                // Read last 20 bytes of calldata
                // and right shift these bytes because
                // calldataload always reads 32 bytes (evm things)
                signer := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        }
    }
}
