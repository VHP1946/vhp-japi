const JMart = require('../bin/mart/jmart.js');

let pack = {
    access:{
        coid:'01',
        request:'JMART'
    },
    pack:{
        table:'custom',
        WebMethod:'GJZJ82J',
        Option:'download',
        CompanyCode:'01',
        Template:'WO_Headers_tbl',
        SELECT:['WorkOrderNumber','CustomerCode','InvoiceNumber','DateCompleted','CostItem','SalesCategoryCode','ReferenceNumber','TechnicianID','TakenBy'],
        WHERE:[{OP:"BETWEEN",DateCompleted:['2022-09-01','2022-09-01']}]
    }
}

let request = new JMart(pack);

console.log(request);
request.then(a=>console.log(a))
