const {Core}=require('vhp-api');


let core = new Core({
    auth:{user:'VOGCH',pswrd:'vogel123'},
    host:'http://localhost:8080/',
    client:true,
    dev:{comments:true,https:false}
});
let pack = {
    access:{
        coid:'01',
        request:'JCALL'
    },
    pack:{
        table:'jticket',
        wonum:'00036435'
    }
}

core.SENDrequest({
    pack:{
        table:'jticket',
        wonum:'00036435'
    },
    request:'JCALL'
}).then(answr=>{console.log(answr);})


/*
const router = require('./bin/router.js');


router(pack).then(a=>console.log(a));
*/
