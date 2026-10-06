import { isStaticApp } from "./environment"

export function require_try(path) : any {
    if(isStaticApp()){
        try{
            require(path)
        }catch(err){
            console.log(err)
        }
    }
    return false;
}