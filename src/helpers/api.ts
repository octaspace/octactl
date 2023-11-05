import { fetchAPIKey, saveUUID } from "./storage";

const fetch = require('node-fetch');
const OCTA_ENDPOINT = "https://api.octa.space/v1"

export async function validateKey(key:string) {
    try{
        if(key==undefined){
            throw new Error('API Key is required')
        }
        if(key.length!=64){
            throw new Error('Invalid API Key')
        }
        const response = await fetch(`${OCTA_ENDPOINT}/accounts`,{method: 'GET', headers: {'Authorization': key}});
        if(response.status==200){
            return true;
        }
        if(response.status==404){
            throw new Error('Invalid API Key')
        }
        return false;
    }
    catch(err:any){
        console.log(err.message)
        return false;
    }
}

export async function fetchDepositAddress() {
    try{
        const key = await fetchAPIKey()
    if(key!=""){
        const response = await fetch(`${OCTA_ENDPOINT}/accounts`,{method: 'GET', headers: {'Authorization': key}});
        if(await response.status==200){
            const data = await response.json()
            return data.deposit_address;
        }
        if(response.status==404){
            throw new Error('Invalid API Key')
        }
    }
    }
    catch(err:any){
        console.log(err.message)
    }
}

export async function fetchBalance() {
    try{
        const key = await fetchAPIKey()
    if(key!=""){
        const response = await fetch(`${OCTA_ENDPOINT}/accounts/balance`,{method: 'GET', headers: {'Authorization': key}});
        if(await response.status==200){
            const data = await response.json()
            return (data.balance * 1e-18).toFixed(4);
        }
        if(response.status==404){
            throw new Error('Invalid API Key')
        }
    }
    }
    catch(err:any){
        console.log(err.message)
    }
}

export async function createWgService(id:string) {
    try{
        const key = await fetchAPIKey()
    if(key!=""){
        let body = {'node_id':parseInt(id),'kind':'wg','subkind':'wg'};
        const response = await fetch(`${OCTA_ENDPOINT}/services/vpn`,{method: 'POST', headers: {'Authorization': key,'Content-Type': 'application/json'}, body:JSON.stringify(body)});
        const res_status = await response.status
        if(res_status==201){
            const uuid = (await response.json()).uuid;
            await saveUUID(uuid);
            for (let i = 0; i < 5; i++)
            {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const response1 = await fetch(`${OCTA_ENDPOINT}/services/${uuid}/info`,{method: 'GET', headers: {'Authorization': key}});
                if(await response1.status==200){
                    const data = await response1.json()
                    if(data.is_ready==true)
                    {
                        return data;
                    }
                }
            }
            throw new Error('Failed to generate config')
        }
        if(res_status==500){
            throw new Error('Unexpected Error')
        }
        if(res_status==400){
            throw new Error((await response.json()).message)
        }
        if(res_status==401){
            throw new Error('Invalid API Key')
        }
        throw new Error('Failed to generate config')
    }
    }
    catch(err:any){
        console.log(err.message)
        return ""
    }
}