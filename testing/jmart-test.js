const JMart = require('../bin/mart/jmart.js');

let pack = {
    access:{
        coid:'01',
        request:'JMART'
    },
    pack:{
        table:'wobynumber',
        wonum:'00036265',
        option:'download'

    }
}


let request = new JMart(pack);

console.log(request);
request.then(a=>console.log(a))
