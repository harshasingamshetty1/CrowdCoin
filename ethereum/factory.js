import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const address ="0xC92224FA3E03Dd74Bed170F6f887836a08924eA0";
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
