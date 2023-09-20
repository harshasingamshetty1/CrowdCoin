import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const address = "0xF0190aD15e89b8760D92CD1E0cFF77567e4Fb2e2";
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
