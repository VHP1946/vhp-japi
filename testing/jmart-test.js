const JMart = require('../bin/mart/jmart.js');

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


let request = new JMart({pack:pack});

console.log(request);
request.then(a=>console.log(a))
