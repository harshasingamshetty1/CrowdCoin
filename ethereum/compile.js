/* these 3 are modules, fs= file system module. 
fs-extra is communtiny devloped and has some extra useful funcs.
removeSync = removes the entire folder
*/

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

console.log("1st cp");

var input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("2nd cp");

/* we just need the contracts part from the compiler 
which might throw so many un wanted stuff aswell
wkt we get 2 complied contracts into output now as we have 2 
contracts in our .sol file
*/
//The second argument (1) is a flag for the solidity optimiser
//-itdoes not specify the number of contracts we are trying to compile.

// const output = solc.compile(source, 1).contracts;
console.log(`The Output of the compiler is =
${output}`);

//this checks if folder exists, if not it'll create that folder

fs.ensureDirSync(buildPath);

/* the output is a json in which we have 2 key value pairs.
1st key is ':Campaign' which has the compiled 1st contract
in its value.
2nd key is ':CampaignFactory' has 2nd.
now using for in loop, we have key set to let contract,
and as we dont want : in our name we replaced it with ''
and also appended .json.
*/

for (let contract in output) {
  /* this function writes out a json file inside
  the specified dir
  path.resolve= gives path where to be stored(including filename)
  params : (path, contentOfFile)
  */

  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
