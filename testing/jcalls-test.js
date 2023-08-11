var jcalls=require('../bin/mart/jcalls.js');

jcalls.jticket({wonum:'00036435'},jcalls.jmart).then(answr=>console.log('REsult',answr));