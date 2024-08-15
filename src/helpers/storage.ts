import * as fs from "node:fs";
import * as path from "node:path";

const configstore = require("conf");

const conf = new configstore({
  projectName: 'octactl',
  encryptionKey: 'bLQVlvQMLf',
  configFileMode: 0o600,
  projectSuffix: ''
});

export function configDir() {
  return `${path.dirname(conf.path)}`;
}

export function saveAPIKey(key: string) {
  try {
    conf.set("apikey", key);
    return true;
  } catch (err) {
    return false;
  }
}

export function fetchAPIKey() {
  if (!conf.has("apikey")) {
    throw new Error("Please Login");
  };
  return conf.get("apikey");
}

export function setLastConnectedNodeID(node_id:string){
  conf.set('lastConnectedNodeID',node_id);
}

export function getlastConnectedNodeID(){
  return conf.get('lastConnectedNodeID');
}

export function fetchWGUUID(node_id: string) {
  return conf.get(`wg.${node_id}.uuid`);
}

export function removeAPIKey() {
  try {
    if (conf.has("apikey")) {
      conf.clear();
      console.log("Logged Out");
      return;
    }
    console.log("Not Logged In");
    return;
  } catch (err) {
    throw err;
  }
}

export async function saveWGConfig(node_id: string, uuid: string, config: string) {
  try {
    const cfg_path = `${configDir()}/octa-wg-${node_id}.conf`;
    fs.writeFileSync(cfg_path, config, { mode: 0o600 });
    conf.set({ wg: { [node_id]: { config: cfg_path, uuid: uuid }}});
    return true;
  } catch (err: any) {
    throw err;
  }
}

export async function removeWGConfig(node_id: string) {
  conf.delete(`wg.${node_id}`);
  fs.rmSync(`${configDir()}/octa-wg-${node_id}.conf`);
}
