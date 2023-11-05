import { install, isSatisfied } from "../helpers/dependency";


export async function init() {
    if(await isSatisfied()){
        console.log("Dependencies are Satisfied")
        return;
    }
    if(await install()){
        console.log("Installation Done")
        return;
    }
    console.log("Please install wireguard, net-tools manually")
    return;
}