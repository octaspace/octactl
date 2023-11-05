import { fetchDepositAddress } from "../helpers/api"

import * as QRCode from 'qrcode';

export async function displayDepositQr(){
    const address = await fetchDepositAddress()
    QRCode.toString(`ethereum:${address}@800001`,{type:'terminal'}, function (err:any, url:any) {
         console.log(url)
         console.log("Note: Only Supports OCTA Network")
         return;
       })
}

export async function displayDepositAddress(){
    const address = await fetchDepositAddress()
    console.log(`Address:${address}`)
    console.log("Note: Only Supports OCTA Network")
    return;
}