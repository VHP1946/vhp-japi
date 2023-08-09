//Libraries used in project
const http = require('http');
const RouteJAPI = require('./bin/router.js');

const PORT = process.env.PORT || 8080//4050; //port for local host

var server = http.createServer();

server.on('request',(req,res)=>{
    //console.log('Request from mart');
    let data = '';
    req.on('data',chunk=>{data+=chunk;});
    req.on('end',()=>{
      try{data=JSON.parse(data);}catch{data={};}
      console.log('JAPI Request',data);
      RouteJAPI(data).then(
        answr=>{
          console.log('DONE',answr);
          res.write(JSON.stringify(answr));//may not want to do this, return only result of request and strip rest of pack
          res.end();
        }
      )
    });
});
server.listen(PORT,()=>{console.log('VAPI Core Listening: ',PORT)})