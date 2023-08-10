/* JONAS API ///////////////////////////////////////////////////////////////////
    Utilizes SOAP protocol to communicate
    url = https://websvc.jonasportal.com/jonasAPI/japi.asmx
    Security code = 3a4d6080ef9393fa1675fa0ce0132f1b
*/
const soapreq = require('easy-soap-request');
var parsexml = require('xml2js').parseString;

const url = 'https://websvcazure.jonasportal.com/jonasAPI/japi.asmx';

const sampleHeaders = {
  'Content-Type':'text/xml'
};

module.exports = class VHPjapi{
    constructor(
        access={user:'VOGCH',pswrd:'vogel123',token:'3a4d6080ef9393fa1675fa0ce0132f1b'}
    ){
        this.access = access;
        //check Access

        this.connected = false; 
        //establish connection

        return {...this}
    }

    /** Sends a request using soaprep to the
     * jonas api.
     * 
     * @param {Object} params 
     * @returns 
     */
    SendRequest=(params={})=>{
      return new Promise((resolve,reject)=>{
        (async () => {
          console.log(params.ask)
          const { response } = await soapreq(
            { url: url,
              headers: sampleHeaders,
              xml: this.CREATEenvelope(params.ask)
            });
    
          const { headers, body, statusCode } = response;
          return resolve(this.PARSEenvelop(body))
        })();
      });
    }
    
    /**Takes the response body and 
     * 
     * @param {String} body 
     */
    PARSEenvelop(body){
        return new Promise((res,rej)=>{
          parsexml(body,(err,result)=>{//parse the body
            let bod = JSON.parse(result['soap:Envelope']['soap:Body'][0]['JonasAPIResponse'][0]['JonasAPIResult']);
            let pbod = {}
            //console.log('RAW >',bod);
            try{
              bod={
                ...bod,
                ...JSON.parse(bod.data)
              }
              bod.data=undefined;
            }catch{bod.succes=false;}
            //console.log('Parsed >',bod);
            try{
              if(bod.errorsFound==0||bod.errorsFound==undefined){ //test for errors *MORE NEEDED HERE
                if(bod[bod.Template]!=undefined){
                    bod.result = bod[bod.Template];//create result and move data to it
                    bod[bod.Template]=undefined;//unset old result object
                }else{bod.result=[]}
              }else{
                try{bod.msg = bod.error[0];}
                catch{bod.msg=bod.message}
                bod.success = false;
              }
            }catch{
              try{bod.msg = bod.error[0];}
              catch{bod.msg=bod.message}
              bod.success = false;
            }
            return res(bod);
          });
        })
    }

    /**Creates the envelope to use in the request
     * 
     * @param {Object} params 
     * @returns 
     */
    CREATEenvelope(params={}){
        return`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jon="jonas.jonasportal.com/">
           <soapenv:Header/>
           <soapenv:Body>
              <jon:JonasAPI>
                 <jon:securityToken>${this.access.token}</jon:securityToken>
                 <jon:username>${this.access.user}</jon:username>
                 <jon:password>${this.access.pswrd}</jon:password>
                 <jon:apiParams>${JSON.stringify(params)}</jon:apiParams>
              </jon:JonasAPI>
           </soapenv:Body>
        </soapenv:Envelope>`

    }

}