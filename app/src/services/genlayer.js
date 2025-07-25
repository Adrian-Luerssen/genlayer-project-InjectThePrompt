import { createClient, createAccount as createGenLayerAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const accountPrivateKey = localStorage.getItem("accountPrivateKey")
  ? localStorage.getItem("accountPrivateKey")
  : null;
export const account = accountPrivateKey ? createGenLayerAccount(accountPrivateKey) : null;

export const createAccount = () => {
  const newAccountPrivateKey = generatePrivateKey();
  localStorage.setItem("accountPrivateKey", newAccountPrivateKey);
  const newAccount = createGenLayerAccount(newAccountPrivateKey);

  // Update the exported account
  Object.assign(account || {}, newAccount);

  return newAccount;
};

export const removeAccount = () => {
  localStorage.removeItem("accountPrivateKey");
};

export const client = createClient({ chain: studionet, account });
