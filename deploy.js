import fs from "fs";
import Arweave from "arweave";
import { SmartWeaveNodeFactory } from "redstone-smartweave";

const CONTRACT = "nft-handler";

const mine = () => arweave.api.get("mine");

const arweave = Arweave.init({
  host: "localhost",
  port: 1985,
  protocol: "http",
});

const smartweave = SmartWeaveNodeFactory.memCached(arweave);

const contractSrc = fs.readFileSync(`./${CONTRACT}/contract.js`, "utf8");

const initialState = fs.readFileSync(
  `./${CONTRACT}/initial-state.json`,
  "utf8"
);

const wallet = fs.readFileSync("./id.json");

const deployContract = async () => {
  console.log("Deploying contract...");
  const contractTransacionId = await smartweave.createContract.deploy({
    wallet: JSON.parse(wallet.toString()),
    initState: initialState,
    src: contractSrc,
  });
  fs.writeFileSync(
    `./${CONTRACT}.json`,
    JSON.stringify({ contractTransacionId })
  );
  console.log(
    `Contract deployed at http://localhost:1985/tx/${contractTransacionId}`
  );
};

const getContract = async () => {
  const tempWallet = await arweave.wallets.generate();
  const originalWallet = JSON.parse(wallet.toString());
  const transactionId = getTransactionId();
  return smartweave.contract(transactionId);
};

const getTransactionId = () => {
  const { contractTransacionId } = JSON.parse(
    fs.readFileSync(`./${CONTRACT}.json`).toString()
  );
  return contractTransacionId;
};

const readState = async () => {
  await mine();
  const contract = await getContract();
  const { state } = await contract.readState();
  console.log({ state });
};

const writeState = async () => {
  const contract = await getContract();
  const response = await contract.writeInteraction({
    method: "feed",
  });

  await readState();
};

readState();
// writeState();
// deployContract();
