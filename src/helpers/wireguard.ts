const { spawn } = require("child_process");

const wginterface = 'octa01';

export async function connect(): Promise<boolean>{
    try{
        if(await isConnected()){
            await disconnect()
        }
        let command = `wg-quick up ${wginterface}`
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
    catch(err:any)
    {
        console.log(err.message)
        return false
    }
}

export async function disconnect(): Promise<boolean> {
    try{
        if(await isConnected())
        {
            let command = `wg-quick down ${wginterface}`
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
        return false;
        }
    catch(err:any){
console.log(err.message)
        return false;
    }
}

export async function isConnected(): Promise<boolean> {
    try{
        let command = `ifconfig | grep "${wginterface}"`
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
    catch(err:any)
    {
        console.log(err.message)
        return false
    }
}