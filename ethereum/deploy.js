const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");
// Import and configure dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" }); // Adjust the path as needed to reach your root .env.local file

const provider = new HDWalletProvider(
  process.env.TEST_SEED_PHRASE,
  process.env.MATIC_PROVIDER
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "5000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
