import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x0BA972e0672464C6846837b969CD03a0b9444166",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Heart Coin",
        description: "This NFT will give you access to MutualAidDAO!",
        image: readFileSync("scripts/assets/heartCoin.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()