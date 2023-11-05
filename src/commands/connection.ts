import { createWgService } from "../helpers/api";
import { saveWGConfig } from "../helpers/storage";
import { connect, disconnect } from "../helpers/wireguard";


export async function connectVPN(id:string) {
    if(id===undefined||id===""){
        console.log('Please specify Node ID as argument')
        return;
    }
    const response = await createWgService(id)
        if(response==""){
            return;
        }
    const ip = response.ip;
    const country = response.country;
    if(await saveWGConfig(response.config)){
    let status = await connect();
    if(status){
        console.log(`Connected\nIP:${ip}\nCountry:${country}`)
        return;
        }
    }
    console.log('Connection Failed')
    return;
}

export async function disconnectVPN(){
    if(await disconnect()){
        console.log("Disconnected")
        return;
    }
    console.log("Not Connected")
}