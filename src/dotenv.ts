const dotenv=require('dotenv');

console.log(process.env.NODE_ENV);
switch(process.env.NODE_ENV){

    case "production":{
        dotenv.config({ path: './env.yarn' }) 
        break;
    }
    case "development":{
        dotenv.config({ path: './env.yarn' }) 
        break; 
    }
    default:{
        dotenv.config({ path: './env.yarn' }) 
        break;
    }
}