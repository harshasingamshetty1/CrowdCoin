import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const address = "0x6120a95f65f7DEA6fDa1Eb726E8AE968E1Ea6212";
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
