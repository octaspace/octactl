
import {Octa, KeyError, ApiError} from '@octaspace/api.js';
import { fetchFile } from '../helpers/storage';

export async function displayVPNNodes() {
    try{
        const key = await fetchFile('key');
        const data = await new Octa(key).getVPNNodes();
        console.table(data);
    }
    catch(err:any){
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