import { fetchAPIKey, fetchWGUUID, saveWGConfig } from "../helpers/storage";
import { connect, disconnect, isConnected } from "../helpers/wireguard";
import { Octa, KeyError } from "@octaspace/api.js";

export async function connectVPN(node_id: string) {
  try {
    if (await isConnected(node_id)) {
      console.log("Connection Already Established");
      return;
    }
    const key = fetchAPIKey();
    const octa = new Octa(key);
    const uuid = (await octa.createVPN("wg", parseInt(node_id))).uuid;
    const data = await octa.getVPN(uuid);
    if (data.is_ready == false) {
      await octa.stopVPN(uuid);
      throw new Error("Connection Failed");
    }
    if (await saveWGConfig(node_id, uuid, data.config.replace(/, ::\/0/g, ''))) {
      let status = await connect(node_id);
      if (status) {
        console.log(`IP: ${data.ip}\nCountry: ${data.country}`);
        return;
      }
    }
    console.log("Connection Failed");
    return;
  } catch (err: any) {
    if (err instanceof KeyError) {
      console.log("Please Login");
      return;
    }
    console.log(err.message);
  }
}

export async function disconnectVPN(node_id: string) {
  try {
    const key = fetchAPIKey();
    const uuid = fetchWGUUID(node_id);
    const status = await isConnected(node_id);
    if (status) {
      await disconnect(node_id);
      await new Octa(key).stopVPN(uuid);
      console.log("Disconnected");
      return;
    }
    console.log("Not Connected");
  } catch (err: any) {
    console.log(err.message);
  }
}
