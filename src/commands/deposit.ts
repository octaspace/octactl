import * as QRCode from 'qrcode';
import { fetchFile } from "../helpers/storage";
import {Octa, KeyError, ApiError} from '@octaspace/api.js';

export async function displayDepositQr(){
    try{
        const token = await fetchFile('key');
    const address =  (await new Octa(token).getAccountInfo()).deposit_address;
    QRCode.toString(`ethereum:${address}@800001`,{type:'terminal'}, function (err:any, url:any) {
         console.log(url)
         console.log("Note: Only Supports OCTA Network")
         return;
       })
    }
    catch(err:any){
        if(err instanceof KeyError)
        {
            console.log('Please Login')
            return
        }
        if(err instanceof ApiError)
        {
            console.log('Network Error')
            return
        }
        console.log(err.message)
    }
}

export async function displayDepositAddress(){
    try{
        const token = await fetchFile('key');
        const address =  (await new Octa(token).getAccountInfo()).deposit_address;
        console.log(`Address:${address}`)
        console.log("Note: Only Supports OCTA Network")
        return;
    }
    catch(err:any){
        if(err instanceof KeyError)
        {
            console.log('Please Login')
            return
        }
        if(err instanceof ApiError)
        {
            console.log('Network Error')
            return
        }
        console.log(err.message)
    }
}