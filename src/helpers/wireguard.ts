const { spawn } = require("child_process");
import * as os from "node:os";

const wginterface = "octa01";
const foldername = ".octacli";

export async function connect(): Promise<boolean> {
  try {
    const homeDir = os.homedir();
    const path = `${homeDir}/${foldername}/${wginterface}.conf`;
    let command =
      os.userInfo().username != "root"
        ? `sudo wg-quick up ${path}`
        : `wg-quick up ${path}`;
    const childProcess = await spawn(command, { shell: true });
    return new Promise<boolean>((resolve) => {
      childProcess.on("close", (code: number) => {
        if (code === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  } catch (err: any) {
    console.log(err.message);
    return false;
  }
}

export async function disconnect(): Promise<boolean> {
  try {
    const homeDir = os.homedir();
    const path = `${homeDir}/${foldername}/${wginterface}.conf`;
    let command =
      os.userInfo().username != "root"
        ? `sudo wg-quick down ${path}`
        : `wg-quick down ${path}`;
    const childProcess = await spawn(command, { shell: true });
    return new Promise<boolean>((resolve) => {
      childProcess.on("close", (code: number) => {
        if (code === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  } catch (err: any) {
    console.log(err.message);
    return false;
  }
}

export async function isConnected(): Promise<boolean> {
  try {
    let command = `ifconfig | grep "${wginterface}"`;
    const childProcess = await spawn(command, { shell: true });
    return new Promise<boolean>((resolve) => {
      childProcess.on("close", (code: number) => {
        if (code === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  } catch (err: any) {
    console.log(err.message);
    return false;
  }
}
