import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { ethers } from "ethers";
import { zipObject } from "lodash";

const addresses = ["0x786E43a1E7Cbacc19b59dcf827659082E88cba9F"];

const allowances = ["8839"];

export default async function handler(req, res) {
  const { address } = req.query;
  const normalized = addresses.map((a) => a.toLowerCase());
  const allowanceLookup = zipObject(normalized, allowances);

  // Return leaf node
  const toLeaf = (addr) =>
    Buffer.from(
      ethers.utils
        .solidityKeccak256(
          ["address", "string"],
          [addr, allowanceLookup[addr.toLowerCase()] || "1"]
        )
        .slice(2),
      "hex"
    );

  const leafNodes = normalized.map(toLeaf);

  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });

  return res.status(200).json({
    proof: merkleTree.getHexProof(toLeaf(address?.toLowerCase())),
    hexRoot: merkleTree.getHexRoot(),
    allowanceLookup,
  });
}
