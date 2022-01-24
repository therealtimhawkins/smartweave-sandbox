import test from "ava";
import { handle } from "../nft-handler/contract.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const initialState = require("../nft-handler/initial-state.json");

let testState;

const buildAction = (input) => {
  return {
    input,
  };
};

test.beforeEach("setup", async (t) => {
  testState = { ...initialState };
});

test("feed() - should decrement hunger by one", (t) => {
  const { state } = handle(
    testState,
    buildAction({
      method: "feed",
    })
  );
  t.is(state.mood.hunger, 7);
});
