module.exports={
    
    wod:{ //use for tech report // pay attention to sorting dates
        jpack:(data)=>{
            let where=[];
            if(data.params!=undefined){
                let params = data.params;
                if(params.CostType!=undefined){where.push({OP:'=',CostType:params.CostType})}
                if(params.fromdate!=undefined&&params.todate!=undefined){where.push({OP:'BETWEEN',PostingDate:[params.fromdate,params.todate]})}
            }
            return{
                Option:'download',
                Template:this.wod.map,
                SELECT:[
                    'Amount',
                    'AuditNumber',
                    'BillingDate',
                    'CostType',
                    'Created',
                    'DepositARCustomerCode',
                    'EmployeeCode',
                    'HoursUnits',
                    'InvoiceNumber',
                    'JournalType',
                    'Notes',
                    'PostingDate',
                    'ReferenceDescription',
                    'ReferenceNumber',
                    'TypeOfHours',
                    'WorkOrderNumber'

                ],
                WHERE:where,
            }
        },
        map:'WO_WODDescription_tbl'
    },
    
    woeom:{
        jpack:(data)=>{
            return{
                Option:'download',
                Template: this.woeom.map
            }
        },
        map:'WO_DetailHistory_tbl'
    },
}