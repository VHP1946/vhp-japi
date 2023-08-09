var JMart = require('./mart/jmart.js');


/**
 * Function to handle and pass the incoming
 * request.
 * 
 * PASS:
 * - ask : {
 *   access:{},
 *   pack:{}
 * }
 */
module.exports = ROUTEjapi=(ask={})=>{
    return new Promise((resolve,reject)=>{
      let {access,pack}=ask;
      let waiter = null;
      console.log(pack, "PACK")
      switch(access.request.toUpperCase()){
        //case 'UPDATEFBOOK':{
        //  console.log("UPDATE F BOOK", pack)
        //  ask.msg='Updating the Jonas Flat Rate Books';
        //  waiter = UPDATEfbook(ask);
        //  break;
        //}
        case 'JMART':{
          console.log('Request JMart');
          waiter = new JMart(ask,true);
          break;
        }
      }
      console.log('Waiter',waiter);
      if(waiter){
        waiter.then(
          answr=>{return resolve(answr);}
        )
      }else{return resolve({success:false,msg:'Could not find request',result:null});}
    });
  }