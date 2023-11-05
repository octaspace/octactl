import * as fs from 'fs';
const { spawn } = require("child_process");


export async function isSatisfied() {
    try{
        let command ='ifconfig && wg-quick'
        const childProcess = await spawn(command, { shell: true });
        return new Promise<boolean>((resolve) => {
            childProcess.on('close', (code: number) => {
              if (code != 127) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
    }
    catch(err:any){
        return false;
    }
}

export async function install(): Promise<boolean> {
    try{
        if(await isSatisfied()){
            return true;
        }
        let command = ''
        const sys_type = await arch();
        if(sys_type==""){
            return false;
        }
        switch(sys_type){
            case "alphine":
            command = 'apk add wireguard-tools net-tools'
            break;
        case "debian":
            command = 'apt install wireguard-tools net-tools -y'
            break;
        case "rpm":
            command = ''
            break;
        default:
            break;
        }
        if(command=='')
        {
            return false;
        }
        console.log("Installing Dependencies")
        const childProcess = await spawn(command, { shell: true });
        return new Promise<boolean>((resolve) => {
            childProcess.on('close', (code: number) => {
              if (code === 0) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
    }
    catch(err:any){
        return false;
    }
}

export async function arch() {
    try {
        if (fs.existsSync('/etc/debian_version')) {
          return "debian";
        } else if (fs.existsSync('/etc/redhat-release') || fs.existsSync('/etc/centos-release')|| fs.existsSync('/etc/fedora-release')) {
          return "rpm";
        } else if (fs.existsSync('/etc/alpine-release')) {
          return "alphine";
        } else {
          return "unknown";
        }
      } catch (err:any) {
        console.error(err.message);
        return "";
      }
}
