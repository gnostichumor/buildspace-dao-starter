import sdk from "./1-initialize-sdk.js";


// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule("0x0B76d105A202b9BC38f55113A5d5655c065Df712");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // Set Token Name ("Ethereum, Matic, etc")
      name: "MutualAidDAO Governance Token",
      // Set token symbol. Ex. "ETH"
      symbol: "MAD",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();