export function handle(state, action) {
  const { method } = action.input;
  if (method === "feed") {
    if (state.mood.hunger > 0) {
      state.mood.hunger = state.mood.hunger - 1;
    }
  }

  setStatus(state);

  return { state };
}

const setStatus = (state) => {
  if (state.mood.hunger > 5) state.status = "hungry";
  else state.status = "happy";
};
