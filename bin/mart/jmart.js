
var VHPjapi = require('../tools/japi.js');
const jmodels = require('./models/jmodels.js');


/**Class to help request JONAS table
 *
 * It can be used in 2 different ways:
 *
 * 1) for one call -
 * 2) for more than one call - In this case you do not have to
 * send it a pack, and you
 *
 */
module.exports=class JMart extends VHPjapi{
    /**
     *
     * @param {
     *   @param{Object} access
     *   @param{Object} pack
     * } pack
     * @returns
     */
    constructor({pack=null,keepalive=false}){
        super();
        this.respack = {
            msg:'table not found',
            success:false,
            result:[]
        }
        this.schemes = jmodels.schemes;
        this.maps = jmodels.maps;
        //console.log(pack);
        if(!keepalive){
            this.reqpack = this.PREPpack(pack);
            //check for good pack?
            return this.RequestTable(this.reqpack,true)
        }
    }

    /**Takes in a table name and returns a request
     * pack.
     *
     * Below is the standard pack to send to JONAS.
     * Jonas pack:{
     *  WebMethod:'',
     *  Option:'',
     *  CompanyCode:'',
     *  Template:'',
     *  SELECT:[],
     *  WHERE:[]
     * }
     *
     * Data can hold any of the above, but can also
     * hold various other aruguments depending on the
     * table being used.
     *
     * @param {String} table
     * @param {Object} data
     * @param {String} coid
     */
    GETtablepack=(table=null,coid="",pack={})=>{
      if(table&&this.schemes[table]){
        let spack = {
          WebMethod:'GJZJ82J',
          CompanyCode:coid,
          Option:pack.option||'template',
          ...this.schemes[table].jpack(pack)
        }
        //console.log('SPACK ',spack);
        return spack;
      }else{return null}
    }

    MAPtable=(table,map)=>{
      if(map){
        //console.log('mapping',table)
        let nlist=[]
        for(let x=0;x<table.length;x++){
          let nobj = {};
          if(table[x]){
            for(let m in map){
              try{if(map[m]!=''&&table[x][m]){nobj[map[m]]=table[x][m]}}
              catch{}
            }
            nlist.push(nobj);
          }
          //console.log('adding ',nlist);
        }return nlist;
      }return table
    }

    /**Takes in request pack and formats it correctly
     * for a Jonas Api Mart call.
     *
     * @param {Object} pack
     */
    PREPpack=(data)=>{
      const {access,pack} = data;
      let cpack = {
        success:false,
        msg:'Bad Company',
        ask:null
      }
      if(access.coid!=''){
          let jpack = this.GETtablepack(pack.table,access.coid,pack);
          if(jpack){
            cpack={
              ...cpack,
              success:true,
              msg:'Good Pack',
              ask:jpack
            }
          }else{
            cpack.msg='Bad Table';
          }
          //console.log('PACK ',cpack)
          return cpack;
      }
      else{return cpack;}
    }

    /**Organize the amount of requests to retrieve
     * the entire table (recursive)
     *
     * @param {Object} params
     * @param {Boolean} all
     * @param {Array} table
     * @param {Number} pagecount
     * @returns
     */
    RequestTable=(params={},all=true,table=[],pagecount=1)=>{
        return new Promise((resolve,reject)=>{
          //console.log('Params >',params);
          if(params.success){
            console.log(pagecount);
            params.ask.PageNum=pagecount; //request the next page
            this.SendRequest(params).then(response=>{
                let jpak={
                    success:params.success,
                    ...response
                }
                if(jpak.isValid){
                    console.log('is ',jpak.PageNum,'max ',jpak.PageMax);
                    if(jpak.Option==='download'&&all&&jpak.PageMax&&jpak.PageMax>pagecount && jpak.result.length !==undefined){ //count iterates 1+ PageMax, JONAS has PageMax+1=last page
                      //console.log('Start Table >',table.length);
                      //console.log('ADD Table >',jpak.result.length);
                        try{table=[...table,...jpak.result];}catch{}//combine the tables to one list
                        console.log('After Add >',table.length);
                        return resolve(this.RequestTable(params,all,table,++pagecount))
                    }else{
                      try{
                        console.log('SENDING ',jpak.result)
                        jpak.result=this.MAPtable([...table,...jpak.result],
                          this.maps[jpak.Template]
                        )//;
                          console.log('After Add >',jpak.result.length);
                      }catch{}
                      console.log('SENDING ',jpak.result)
                      return resolve(jpak);
                    }
                }else{return resolve(jpak);}
            })
          }else{
            return resolve(params);
          }
        });
    }

    Request=(table,coid,pack)=>{
        //console.log(this.GETtablepack(table,coid,pack))
        return this.RequestTable({
            success:true,
            msg:'Requesting',
            ask:this.GETtablepack(table,coid,pack)
        },true)
    }
}
