const {Core}=require('vhp-api');


let core = new Core({
    auth:{user:'VOGCH',pswrd:'vogel123'},
    sync:false,
    host:'http://172.27.32.1:8080/',//'http://localhost:8080/',//
    client:true,
    dev:{comments:true,https:false}
});
core.connected=true;
let pack = {
    access:{
        coid:'01',
        request:'JMART'
    },
    pack:{
        table:'wobynumber',
        option:'download',
        wonum:'00036465' //issue -> 36435
    }
}

console.log('about')
core.SENDrequest({
    pack:pack.pack,
    request:'JMART'
}).then(answr=>{console.log(answr);})


/*
const router = require('./bin/router.js');


router(pack).then(a=>console.log(a));
*/
