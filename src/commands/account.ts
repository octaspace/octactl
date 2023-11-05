import { fetchBalance, validateKey } from "../helpers/api";
import { removeAPIKey, saveAPIKey } from "../helpers/storage";


export async function login(key: string) {
    if(await validateKey(key)&&saveAPIKey(key)){
        console.log("Logged In")
        return;
    }
    return;
}

export function logout(){
    removeAPIKey();
    return;
}

export async function balance(){
    let bal = await fetchBalance()
    console.log(`Balance:${bal} OCTA`)
    return;
}