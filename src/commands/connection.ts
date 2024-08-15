import { validateIPv4Address, validateMTU } from "../helpers/functions";
import { fetchAPIKey, fetchWGUUID, getlastConnectedNodeID, saveWGConfig, setLastConnectedNodeID } from "../helpers/storage";
import { connect, disconnect, isConnected } from "../helpers/wireguard";
import { Octa, KeyError } from "@octaspace/api.js";

export async function connectVPN(node_id: string, dns:string, mtu:number) {
  try {
    if (await isConnected(node_id)) {
      console.log("Connection Already Established");
      return;
    }
    if(dns!='' && !validateIPv4Address(dns)){
      console.log("Invalid DNS Server IP");
      return;
    }
    if(mtu!=1420 && !validateMTU(mtu)){
      console.log("Invalid MTU Size");
      return;
    }
    const key = fetchAPIKey();
    const octa = new Octa(key);
    const uuid = (await octa.createVPN("wg", parseInt(node_id))).uuid;
    setLastConnectedNodeID(node_id);
    let data = await octa.getVPN(uuid,5,2000);
    if (data.is_ready == false) {
      await octa.stopVPN(uuid);
      throw new Error("Connection Failed");
    }
    let config:string = String(data.config).replace(/, ::\/0/g, '')
    if(dns!=''){
      config = String(config).replace(/DNS\s*=\s*([^\n]*)/,`DNS  = ${dns}`)
    }
    if(mtu!=1420){
      config = String(config).replace(/\[Interface\]\n/, `[Interface]\nMTU = ${mtu}\n`);
    }
    console.log(config)
    if (await saveWGConfig(node_id, uuid, config)) {
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

export async function disconnectVPN() {
  try {
    const key = fetchAPIKey();
    const node_id = getlastConnectedNodeID();
    console.log(node_id)
    const status = await isConnected(node_id);
    if (status) {
      const uuid = fetchWGUUID(node_id);
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
