var j2vconvert = require('./maps/jonas-table-headers.json');
var VHPjapi = require('./tools/japi.js');


/**
 * Map for available tables. If the table is
 * not in the list, in can be reached by using
 * custom and giving the tables "Jonas" name.
 * 
 * Ideally the map could be held and maintained
 * in an external json file (or whatever). 
 * 
 * A function to assign the the template (table)
 * can be created.
 */
var j2vtables = {
    custom:{
      jpack:{
        WebMethod:'GJZJ82J',
        Option:'template',
        CompanyCode:'',
        Template:'',
      },
      map:{}
    },
    flatratebook:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_FlatRateBookPricing_tbl',
          WHERE:[{OP:'=',FlatRateBookCode:data.bookcode||''}]
        }
      }
    },
    wonumber:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_Headers_tbl',
          WHERE:[{OP:'=',WorkOrderNumber:data.wonum||''}]
        }
      }
    },
    contracttable:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_SC_ServiceContractMaster_tbl',
          WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
        }
      }
    },
    customertable:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'AR_CustomerMaster_tbl',
          WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
        }
      }
    },
    custserviceitems:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'AR_CustomerServiceItems_tbl',
          WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
        }
      }
    },
    woheaders:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_Headers_tbl',
          SELECT:['WorkOrderNumber','CustomerCode','InvoiceNumber','DateCompleted','CostItem','SalesCategoryCode','ReferenceNumber','TechnicianID','TakenBy'],
          WHERE:[{OP:"BETWEEN",DateCompleted:['2022-09-01','2022-09-01']}]
        }
      }
    },
    woinvoicing:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_InvoiceBillingRecap_tbl'
        }
      }
    },
    wod:{ //use for tech report // pay attention to sorting dates
      jpack:(data)=>{
        let where=[];
        let select=data.params.select!=undefined?data.params.select:[];
        if(data.params!=undefined){
          let params = data.params;
          if(params.CostType!=undefined){where.push({OP:'=',CostType:params.CostType})}
          if(params.fromdate!=undefined&&params.todate!=undefined){where.push({OP:'BETWEEN',PostingDate:[params.fromdate,params.todate]})}
        }
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_WODDescription_tbl',
          WHERE:where,
          SELECT:select
        }
      },
      map:(it={})=>{
        if(!it||it==undefined){it={};}
        return{
          Amount: it.Amount!=undefined?it.Amount:0,
          AuditNumber: it.AuditNumber!=undefined?it.AuditNumber:null,
          BillingDate: it.BillingDate!=undefined?it.BillingDate:null,
          CostType: it.CostType!=undefined?it.CostType:'',
          Created: it.Created!=undefined?it.Created:'',
          DepositARCustomerCode: it.DepositARCustomerCode!=undefined?it.DepositARCustomerCode:'',
          EmployeeCode: it.EmployeeCode!=undefined?it.EmployeeCode:null,
          HoursUnits: it.HoursUnits!=undefined?it.HoursUnits:0,
          InvoiceNumber: it.InvoiceNumber!=undefined?it.InvoiceNumber:null,
          JournalType: it.JournalType!=undefined?it.JournalType:null,
          Notes: it.Notes!=undefined?it.Notes:'',
          PostingDate: it.PostingDate!=undefined?it.PostingDate:null,
          ReferenceDescription: it.ReferenceDescription!=undefined?it.ReferenceDescription:'',
          ReferenceNumber: it.ReferenceNumber!=undefined?it.ReferenceNumber:null,
          TypeOfHours: it.TypeOfHours!=undefined?it.TypeOfHours:null,
          WorkOrderNumber: it.WorkOrderNumber!=undefined?it.WorkOrderNumber:null
        }
      }
    },
    woeom:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template: 'WO_DetailHistory_tbl'
        }
      }
    },
    wohistory:{
      jpack:(data)=>{
        return{
          WebMethod:'GJZJ82J',
          Option:'download',
          CompanyCode:'01',
          Template:'WO_WorkOrderHistory_tbl'
        }
      }
    }
  }


/**
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
    constructor(pack){
        super();
        this.respack = {
            msg:'table not found',
            success:false,
            result:[]
        }
        this.schemes = j2vtables;
        console.log(this.schemes);
        this.reqpack = this.PREPpack(pack);
        //try{
        //   this.reqpack.fail;
        //    console.log('Failed');
        //    return {...this.reqpack};
        //}
        //catch{
            //this.map = j2vtables[this.reqpack];
            return this.RequestTable(this.reqpack,true)
        //}
    }

    /**Takes in a table name and returns a request
     * pack.
     * 
     * @param {Object} data 
     * @param {String} coid 
     */
    GETtable=(table=null,coid="",pack={})=>{
      if(table&&this.schemes[table]){
        let spack = this.schemes[table].jpack;
        spack.CompanyCode = coid;
        console.log('SPACK ',spack);
        for(let p in pack){
          spack[p] = pack[p]
        }
        return spack;
      }else{return null}
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
          let jpack = this.GETtable(pack.table,access.coid,pack);
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
          console.log('PACK ',cpack)
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
    RequestTable=(params={},all=true,table=[],pagecount=0)=>{
        return new Promise((resolve,reject)=>{
          console.log('Params >',params);
          if(params.success){
            params.PageNum=pagecount++; //request the next page
            this.SendRequest(params).then(response=>{
              console.log('Response ',response)
                let jpak={
                    ...response,
                    table:table
                }
                if(jpak.success){
                    if(jpak.Template==='download'&&all&&jpak.PageMax>=pagecount){ //count iterates 1+ PageMax, JONAS has PageMax+1=last page
                        try{table=table.concat(this.CONVERTtable(jpak.result));}catch{}//combine the tables to one list
                        return resolve(this.RequestTable(params,this.map,all,table,pagecount))
                    }else{
                      try{
                        jpak.result=table.concat(this.CONVERTtable(this.map,jpak.result))//;
                      }catch{}
                      return resolve(jpak);
                    }
                }else{return resolve(jpak);}
            })
          }else{
            return resolve(params);
          }
        });
    }

    /**Takes an item an item from the response
     * result and maps it to the cor
     * 
     * @param {Object} item 
     * @param {Object} map 
     * @returns 
     */
    MAPitem=(item,map)=>{
        let nitem={};
        try{
          for(let i in item){
            if(map[i]!=''&&map[i]!=undefined){
              nitem[map[i]]=item[i];
            }
          }
          return nitem;
        }catch{return item}
    }

    /**Takes the table from response and
     * converts the items to "vhp" object.
     * 
     * 
     * @param {Object} template 
     * @param {Array} table 
     */
    CONVERTtable=(template,table)=>{
        for(let x=0;x<table.length;x++){
            table[x]=this.MAPitem(table[x],j2vconvert[template]);
        }
        return table;
    }

}