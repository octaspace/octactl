import * as os from "node:os";
import * as fs from "fs";

const configstore = require("conf");

//for storing wg config file
const foldername = ".octactl";
const wginterface = "octa01";

const conf = new configstore({
  projectName: 'octactl',
  encryptionKey: 'bLQVlvQMLf',
  configFileMode: 0o600,
  projectSuffix: ''
});

type fetchData = "key" | "uuid";

export function saveAPIKey(key: string) {
  try {
    conf.set("apikey", key);
    return true;
  } catch (err) {
    return false;
  }
}

export function fetchFile(property: fetchData) {
  try {
    if (!conf.has("apikey")) {
      throw new Error("Please Login");
    }
    switch (property) {
      case "key":
        return conf.get("apikey");
      case "uuid":
        return conf.get("uuid");
      default:
        return "";
    }
  } catch (err: any) {
    throw err;
  }
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

export function saveUUID(uuid: string) {
  try {
    conf.set("uuid", uuid);
    return true;
  } catch (err: any) {
    throw err;
  }
}

export async function saveWGConfig(config: string) {
  try {
    const homeDir = os.homedir();
    const path = `${homeDir}/${foldername}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    fs.writeFileSync(`${path}/${wginterface}.conf`, config);
    return true;
  } catch (err: any) {
    throw err;
  }
}

export async function removeWGConfig() {
  try {
    const homeDir = os.homedir();
    const path = `${homeDir}/${foldername}`;
    if (!fs.existsSync(path)) {
      return;
    }
    fs.rmSync(`${path}/${wginterface}.conf`);
    return;
  } catch (err: any) {
    throw err;
  }
}
