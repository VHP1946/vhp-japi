const {Core}=require('vhp-api');


let core = new Core({
    auth:{user:'VOGCH',pswrd:'vogel123'},
    sync:false,
    host:'http://localhost:7050/',//'http://3.135.187.89/',//'http://172.27.32.1:8080/',// 
    client:true,
    dev:{comments:true,https:false}
});
core.connected=true;

// CUMM02
let pack = {
    access:{
        coid:'01',
        request:'JCALL'
    },
    pack:{
        table:'scbydept',
        option:'download',
        cat:'350'
        //status:'A'
        //custcode:'CUMM02' //issue -> 36435
        //wonum:'00005642'
    }
}

console.log('about')
core.SENDrequest({
    pack:pack.pack,
    route:'JAPI',
    request:'JMART'
}).then(answr=>{console.log(answr.result.length);})


/*
const router = require('./bin/router.js');


router(pack).then(a=>console.log(a));
*/
