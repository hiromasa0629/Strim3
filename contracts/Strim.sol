// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

struct ClipDetail {
    address host;
    uint streamTokenId;
    uint nonce;
}

struct TokenDetailReturn {
    uint tokenId;
    string uri;
}

contract Strim is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    /**
     * For every new stream the sender created, strimNonce++
     * Tracks the tokenId for each nonce
     */
    mapping(address => uint) public strimNonce;
    mapping(address => mapping(uint => uint)) public strimNonceToTokenId;

    /**
     * TokenId to host address
     */
    mapping(uint => ClipDetail) public clipDetail;

    /**
     * Stream tokenId to clip tokenId array
     */
    mapping(uint => uint[]) public strimClips;

    /**
     * Clips that a address own
     */
    mapping(address => uint[]) public addressToClips;

    constructor() ERC721("Strim", "STRIM") {}

    /**
     * Create stream.
     * Increment address nonce everytime a new stream is created.
     * Leave token URI empty so after finish stream, it will upload to ipfs and set token URI
     */
    function createStrim() public {
        _tokenIdCounter.increment();
        uint newTokenId = _tokenIdCounter.current();

        _safeMint(msg.sender, newTokenId);
        strimNonce[msg.sender] += 1;
        uint nonce = strimNonce[msg.sender];
        strimNonceToTokenId[msg.sender][nonce] = newTokenId;
    }

    /**
     * Checks if msg.sender owns the token which was minted when the stream is created.
     * Then modify the host stream uri.
     */
    function modifyStrimURI(string memory uri) public {
        require(
            _isStreamHost(),
            "Only stream host is allowed to modifyStrimURI"
        );
        uint nonce = strimNonce[msg.sender];
        uint tokenId = strimNonceToTokenId[msg.sender][nonce];
        require(_exists(tokenId), "You do not have any Stream");
        _setTokenURI(strimNonceToTokenId[msg.sender][nonce], uri);
    }

    /**
     * Mint stream clip
     */
    function clip(address host, string memory uri) external {
        _tokenIdCounter.increment();

        uint newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);
        uint nonce = strimNonce[host];
        uint strimTokenId = strimNonceToTokenId[host][nonce];
        clipDetail[newTokenId].host = host;
        clipDetail[newTokenId].nonce = nonce;
        clipDetail[newTokenId].streamTokenId = strimTokenId;

        strimClips[strimTokenId].push(newTokenId);

        addressToClips[msg.sender].push(newTokenId);
    }

    /**
     * Return all stream that has been created by address
     *
     * returns: an array of tokenURIs
     */
    function getAllStream(
        address sender
    ) external view returns (TokenDetailReturn[] memory) {
        uint nonce = strimNonce[sender];
        TokenDetailReturn[] memory res = new TokenDetailReturn[](nonce);
        for (uint i = 1; i <= nonce; i++) {
            uint tokenId = strimNonceToTokenId[sender][i];
            string memory uri = tokenURI(tokenId);
            res[i - 1].tokenId = tokenId;
            res[i - 1].uri = uri;
        }
        return res;
    }

    /**
     * returns: an array of clips a address own
     */
    function getAllClip(
        address sender
    ) external view returns (TokenDetailReturn[] memory) {
        uint[] memory clips = addressToClips[sender];
        TokenDetailReturn[] memory res = new TokenDetailReturn[](clips.length);
        for (uint i = 0; i < clips.length; i++) {
            string memory uri = tokenURI(clips[i]);
            res[i].tokenId = clips[i];
            res[i].uri = uri;
        }
        return res;
    }

    /**
     * Return: an array of clips under the given stream tokenId
     */
    function getAllClipsUnderStream(
        uint tokenId
    ) external view returns (TokenDetailReturn[] memory) {
        uint[] memory clips = strimClips[tokenId];
        TokenDetailReturn[] memory res = new TokenDetailReturn[](clips.length);
        for (uint i = 0; i < clips.length; i++) {
            string memory uri = tokenURI(clips[i]);
            res[i].tokenId = clips[i];
            res[i].uri = uri;
        }
        return res;
    }

    function _isStreamHost() internal view returns (bool) {
        uint nonce = strimNonce[msg.sender];
        uint tokenId = strimNonceToTokenId[msg.sender][nonce];
        return ownerOf(tokenId) == msg.sender;
    }

    /**
     *	Overrides
     */
    function _burn(uint tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
