import * as os from 'node:os';
import * as fs from 'fs';

const filename = 'secret.json';
const foldername = '.octacli';
const wginterface = 'octa01';

type fetchData ='key'|'uuid';

interface data {
    key:string
    services:{
        uuid:string
    }
}

export function saveAPIKey(key:string) {
    try{
        const homeDir = os.homedir();
        const path = `${homeDir}/${foldername}`
        const data :data = {key:key,services:{uuid:""}};
        if (!fs.existsSync(path)) {
            fs.mkdir(path, { recursive: true }, (err) => {
                if (err) throw err;
              });
        }
        fs.writeFile(`${path}/${filename}`, JSON.stringify(data), (err)=>{
            if (err) throw err;
            else
            {
                console.log('Success');
                return true;
            }
        })
    }
    catch(err){
        console.log(err);
        return false;
    }
}

export async function fetchFile(property:fetchData) {
    try{
        const homeDir = os.homedir();
        const path = `${homeDir}/${foldername}/${filename}`
        if (!fs.existsSync(path)) {
            throw Error("Please Login")
        }
        const file_data : data= JSON.parse(fs.readFileSync(path).toString())
        switch(property)
        {
            case 'key':
                if(file_data.key!==null&&file_data.key.length==64)
                {
                    return file_data.key;
                }
            break;
            case 'uuid':
                if(file_data.services.uuid!==null)
                {
                    return file_data.services.uuid;
                }
            break;
            default:
                return "";
        }
        return "";
    }
    catch(err:any){
        console.log(err.message)
        return ""
    }
}

export function removeAPIKey() {
    try{
        const homeDir = os.homedir();
        const path = `${homeDir}/${foldername}`
        if (fs.existsSync(path)) {
            fs.rm(path, { recursive: true }, (err) => {
                if (err) throw err;
                else console.log("Logged Out");
                return;
              });
        }
        else{
            console.log("Not Logged In")
        }
        return;
    }
    catch(err){
        console.log(err);
        return;
    }
}

export async function saveWGConfig(config:string) {
    try{
        const path = `/etc/wireguard/`
        if (!fs.existsSync(path)) {
            throw new Error('Seems Wireguard is not properly installed')
        }
        fs.writeFileSync(`${path}/${wginterface}.conf`, config.toString())
        return true;
    }
    catch(err:any){
        console.log(err.message);
        return false;
    }
}

export async function saveUUID(uuid:string) {
    try{
        const homeDir = os.homedir();
        const path = `${homeDir}/${foldername}`;
        const key = await fetchFile('key');
        const data :data = {key:key,services:{uuid:uuid}};
        if (!fs.existsSync(path)) {
            fs.mkdir(path, { recursive: true }, (err) => {
                if (err) throw err;
              });
        }
        fs.writeFile(`${path}/${filename}`, JSON.stringify(data), (err)=>{
            if (err) throw err;
            else
            {
                return true;
            }
        })
        return true;
    }
    catch(err:any){
        console.log(err.message);
        return false;
    }
}