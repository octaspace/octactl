import { fetchFile, saveUUID, saveWGConfig } from "../helpers/storage";
import { connect, disconnect, isConnected } from "../helpers/wireguard";
import {Octa, KeyError, ApiError} from '@octaspace/api.js';

export async function connectVPN(id:string) {
    try{
        if(id===undefined||id===""){
            console.log('Please specify Node ID as argument')
            return;
        }
        const key = await fetchFile('key');
        const octa = new Octa(key)
        const uuid = (await octa.createVPN('wg',parseInt(id))).uuid;
        saveUUID(uuid);
        const data = await octa.getVPN(uuid);
        if(data.is_ready==false)
        {
            await octa.stopVPN(uuid);
            throw new Error('Connection Failed')
        }
        const ip = data.ip;
        const country = data.country;
        if(await saveWGConfig(data.config)){
        let status = await connect();
        if(status){
            console.log(`Connected\nIP:${ip}\nCountry:${country}`)
            return;
            }
        }
        console.log('Connection Failed')
        return;
    
    }
    catch(err:any)
    {
        if(err instanceof KeyError){
            console.log("Please Login")
            return;
        }
        if(err instanceof ApiError){
            console.log("Network Error")
            return;
        }
        console.log(err.message)
    }
}

export async function disconnectVPN(){
    const key = await fetchFile('key');
    const uuid = await fetchFile('uuid');
    const status = await isConnected()
    if(status){
        if(await disconnect())
        console.log("Disconnected")
        await new Octa(key).stopVPN(uuid);
        return;
    }
    console.log("Not Connected")
}