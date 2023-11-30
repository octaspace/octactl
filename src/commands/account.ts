import { fetchFile, removeAPIKey, saveAPIKey } from "../helpers/storage";
import { Octa, KeyError, ApiError } from "@octaspace/api.js";

export async function login(key: string) {
  try {
    if (key == undefined) {
      throw new Error("API Key is required");
    }
    if (key.length != 64) {
      throw new Error("Invalid API Key");
    }
    const balance = (await new Octa(key).getAccountBalance()).balance;
    if (typeof balance == "number" && saveAPIKey(key)) {
      console.log("Logged In");
      return;
    }
    return;
  } catch (err: any) {
    if (err instanceof KeyError) {
      console.log("Invalid API Key");
      return;
    }
    if (err instanceof ApiError) {
      console.log("Network Error");
      return;
    }
    console.log(err.message);
  }
}

export function logout() {
  removeAPIKey();
  return;
}

export async function balance() {
  try {
    const token = await fetchFile("key");
    const balance = (await new Octa(token).getAccountBalance()).balance;
    let bal = (balance * 1e-18).toFixed(4);
    console.log(`Balance:${bal} OCTA`);
    return;
  } catch (err: any) {
    if (err instanceof KeyError) {
      console.log("Please Login");
      return;
    }
    if (err instanceof ApiError) {
      console.log("Network Error");
      return;
    }
    console.log(err.message);
  }
}
