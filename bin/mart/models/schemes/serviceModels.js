
const WOtable = 'WO_Headers_tbl';
const SELECTwo=[]

/*Not Ready

    wohistory:{
        jpack:(data)=>{
            return{
                Template:this.wohistory.map
            }
        },
        map:'WO_WorkOrderHistory_tbl'
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
*/

module.exports={
    womaster:{
        jpack:(data)=>{
            return{
                Template:this.womaster.map,
                SELECT:data.select||SELECTwo,
                WHERE:data.where||[]
            }
        },
        map:WOtable
    },
    wobynumber:{
        jpack:function(data){
            return{
                Template:this.map,
                SELECT:data.select||SELECTwo,
                WHERE:[{OP:'=',WorkOrderNumber:data.wonum||''}]
            }
        },
        map:WOtable
    },
    wobydate:{
        jpack:(data)=>{
            return{
                Template:this.wobydate.map,
                SELECT:data.select||SELECTwo,
                WHERE:[{OP:"BETWEEN",DateCompleted:data.range||[Date.now,Date.now]}]
            }
        },
        map:WOtable
    },
    flatratebook:{
        jpack:(data)=>{
            return{
                Template:'WO_FlatRateBookPricing_tbl',
                WHERE:[{OP:'=',FlatRateBookCode:data.bookcode||''}]
            }
        },
        map:'WO_FlatRateBookPricing_tbl'
    },
}