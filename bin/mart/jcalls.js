/**This is a place for combination calls setup for a specific
 * reason or application. All functions will use JMart to
 * accomplish this.
 *
 * To add calls, include them in the module.exports. The name
 * given in the module will be the call name (but uppercased).
 *
 *
 * For now this file will hold all the calls. If call numbers
 * grow, this file can act as a
 *
 */
const JMart = new require('./jmart.js');


module.exports={
    jmart:new JMart({keepalive:true}),

    CallRoute:function(data){
        return new Promise((resolve,reject)=>{
            // /console.log('DATA',data);
            if(this.calls[data.table]){
                return resolve(this.calls[data.table](data,this.jmart));
            }else{return resolve({
                success:false,
                msg:'Not a call',
                result:null
            })}
        });
    },
    calls:{
	    ...require('./calls/ticketing.js'),
        ...require('./calls/service-items.js')
    }

}
