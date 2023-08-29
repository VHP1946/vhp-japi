   
/**
 * 
 * @param {*} w 
 * @returns 
 */
var aticket = (w)=>{
    if(!w || w==undefined){
        w = {};
    }
    return {
        id: w.id || '', //WorkOrderNumber

        custcode:w.custcode||'', //CustomerCode
        contactname:w.contactname||'',
        contactphone:w.contactphone||'',
        contactemail:w.contactemail||'',
        customername:w.customername||'',

        descr:w.descr||'',
        street:w.street||'',
        cityzip:w.cityzip||'',
        unit:w.unit||'',
        state:w.state||'',

        takenby:w.takenby||'', //TakenBy
        dept:w.dept||'', //SalesCategoryCode *needs " " trimming
        cat:w.cat||'', //WorkOrderCateogry *needs further referencing
        leadsource:w.leadsource||'',
        status:w.status||'', //WOStatusCode

        jobref:w.jobref||'',
        conref:w.conref||'',
        ref:w.ref||'',

        pricebook:w.pricebook||'', //FlatRateBook
        pricelevel:w.pricelevel||'', //PriceLevel

        salesrep:w.salesrep||'', //TerritorySalespersonCode
        tech:w.tech||'', //TechnicianID

        datecall:w.datecall||'',
        timecall:w.timecall||'',

        dateorder:w.dateorder||'',
        timeorder:w.timeorder||'',

        dateschedule:w.dateschedule||'',
        timeschedule:w.timeschedule||'',

        datestart:w.datestart||'',
        timestart:w.timestart||'',

        datedispatch:w.datedispatch||'',
        timedispatch:w.timedispatch||'',

        datearrival:w.datearrival||'',
        timearrival:w.timearrival||'',

        datecomplete:w.datecomplete||'',
        timecomplete:w.timecomplete||'',

        datecompletesched:w.datecompletesched||'',
        timecompletesched:w.timecompletesched||''
    }
}
module.exports={
    /**Retrieves a ticket for the LST
     * 
     * the arugment is the request pack sent from the client
     * 
     * @param {
    *   table:String, (jticket)
    *   wonumber:String,
    * } pack 
    * @returns 
    */
    
    jticket:({wonum=null},jmart)=>{
        return new Promise((resolve,reject)=>{
            let wo = null;
            if(wonum){
                console.log('Retrieve Ticket ---------------------');
                jmart.Request('wobynumber','01',{
                    table:'wobynumber',
                    wonum:wonum,
                    option:'download'
                }).then(woresp=>{//console.log('WO >',woresp);
                    if(woresp.isValid&&woresp.result && woresp.result.length===1){
                        wo = aticket(woresp.result[0]);//create wo
                        jmart.Request('custom','01',{
                            option:'download',
                            template:'WO_DescriptionOfWork_tbl',
                            where:[{OP:'=',WorkOrderNumber:wonum}]
                        }).then(wodresp=>{//console.log('Description of Work > ',wodresp);
                            if(wodresp.success){
                                wo.descr='';
                                for(let x=0,l=wodresp.result.length;x<l;x++){
                                    wo.descr+=wodresp.result[x].WorkDescription +'\n';
                                }
                            }//if could not find, should say something?
                            jmart.Request('custom','01',{
                                option:'download',
                                template:'AR_CustomerPreferences_tbl',
                                where:[{OP:'=',CustomerCode:wo.custcode}]
                            }).then(emailresp=>{//console.log('Email Address >',emailresp);
                                if(emailresp.isValid){
                                wo.contactemail=emailresp.result[0]?emailresp.result[0].EmailAddress:'';
                                }
                                jmart.Request('custom','01',{
                                    option:'download',
                                    template:'AR_CustomerMaster_tbl',
                                    where:[{OP:'=',CustomerCode:wo.custcode}]
                                }).then(custresp=>{//console.log('Customer Name >',custresp);
                                    if(custresp.isValid){wo.customername=custresp.result[0].CustomerName;}
                                    return resolve({
                                        success:true,
                                        msg: 'Heres your ticket',
                                        result:wo
                                    });
                                });
                            });
                        });
                    }else{return resolve({
                        success:false,
                        msg:'Could not find WO',
                        result:null
                    })}
                
                });
            }else{
                return resolve({
                    success:false,
                    msg:'No wonumber given',
                    result:null
                });
            } 
        });
    }
    
    
}