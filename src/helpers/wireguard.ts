import { spawn } from "node:child_process";
import { configDir, removeWGConfig } from "./storage";

export async function connect(node_id: string): Promise<boolean> {
  return exec(`sudo wg-quick up ${configDir()}/octa-wg-${node_id}.conf`);
}

export async function disconnect(node_id: string): Promise<boolean> {
  await exec(`sudo wg-quick down ${configDir()}/octa-wg-${node_id}.conf`);
  await removeWGConfig(node_id);
  return true;
}

export async function isConnected(node_id: string): Promise<boolean> {
  return exec(`sudo wg show octa-wg-${node_id}`);
}

async function exec(cmd: string): Promise<boolean> {
  try {
    const childProcess = await spawn(cmd, { shell: true });
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
