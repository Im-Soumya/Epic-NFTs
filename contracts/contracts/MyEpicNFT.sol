//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Janick", "Kirk", "Tony", "Michael", "Slash", "Billie"];
    string[] secondWords = ["BlackSabbath", "Steppenwolf", "IronMaiden", "Metallica", "GunsN'Roses", "GreenDay"];
    string[] thirdWords = ["Cupcake", "Pizza", "Milkshake", "Curry", "Chicken", "Salad", "Sandwich"];
    string[] colours = ["#183182", "#34073d", "#ef745c", "#007f5f", "#333533", "#720026"];

    constructor() ERC721("Square NFTs", "SQR") {
        console.log("This is a NFT smart contract");
    }

    function findFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand  % firstWords.length;
        return firstWords[rand];
    }

    function findSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function findThirdWord (uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function findRandomColor (uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colours.length;
        return colours[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnEpicNFT() public {
        uint256 newItemId = _tokenIds.current();

        string memory firstWord = findFirstWord(newItemId); 
        string memory secondWord = findSecondWord(newItemId); 
        string memory thirdWord = findThirdWord(newItemId); 
        string memory colour = findRandomColor(newItemId);

        string memory combinedword = string(abi.encodePacked(firstWord, secondWord, thirdWord));
        string memory finalSvg = string(abi.encodePacked(svgPartOne, colour, svgPartTwo, combinedword, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',combinedword,'", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',Base64.encode(bytes(finalSvg)),'"}'
                    )
                )
            )
        );

        string memory finalURI = string(abi.encodePacked("data:application/json;base64,", json));

        console.log("\n---------------");
        console.log(finalURI);
        console.log("---------------\n");

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, "finalURI");
        
        _tokenIds.increment();
        console.log("An NFT with ID %s has been minted to %s", newItemId, msg.sender);
    }
}