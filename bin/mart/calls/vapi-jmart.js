

//WO_DetailHistory_tbl
//WO_DescOfWorkPerformed_tbl
//WO_DescriptionOfWork_tbl
//WO_DescriptOfWorkPerformedForBill_tbl
//WO_Profile_tbl *to get the WO categories
//WO_FlatRate_tbl *
//WO_ServiceItemComments_tbl

//AR_ServiceItemCustomTables_tbl
//AR_ServiceItemCustomInfo_tbl * use for custom service items
//AR_ServiceItemCustomInfoLog_tbl

/*
GETjapitest().then(
  res=>{
    let arr=[]
    for(let x in res.body.table[0]){arr.push(x);}
    console.log(arr);
    var wopull = {
        table:'test',
        option:'download',
        template:'AR_ServiceItemCustomInfo_tbl',
        where:[{OP:'=',CustomerCode:'801C01'}]
    };
    SENDrequest(vurl,vapp,wopull).then(
            res=>{console.log(res);}
        );
  });
//*/

var GETjapitest=()=>{
  return new Promise((res,rej)=>{
      var wopull = {
          table:'test',
          option:'template',
          template:'AR_ServiceItemCustomInfo_tbl'
      };
      return res(SENDrequest(vurl,vapp,wopull));
  });
}

var GETresflbook=(wonum,table='flatratebook')=>{
    return new Promise((res,rej)=>{
        let opts = {
            table:table,
            bookcode:'RES'
        };
        return res(SENDrequestapi(opts,'jmart'));
    })
}
var GETscontract=(custcode,table='contracttable')=>{
  return new Promise((res,rej)=>{
      let wopull = {
          table:'contracttable',
          custcode:custcode
      };
      return res(SENDrequestapi(opts,'jmart'));
  })
}
var GETwo=(wonum,table='wonumber')=>{
    return new Promise((res,rej)=>{
        let opts = {
            table:table,
            wonum:wonum,//'00024530'
        };
        let wo = null;
        if(wonum){
          SENDrequestapi(opts,'jmart').then(
            answr=>{
              if(answr.body.success&&answr.body.table.length==1){
                wo = awo(answr.body.table[0]);
                let opts2 = {
                    table:'test',
                    option:'download',
                    template:'WO_DescriptionOfWork_tbl',
                    where:[{OP:'=',WorkOrderNumber:wonum}]
                };
                SENDrequestapi(opts2,'jmart').then( //bring in descriptions
                  answr=>{
                    if(answr.body.success){
                      wo.descr=''
                      for(let x=0,l=answr.body.table.length;x<l;x++){
                        wo.descr+=answr.body.table[x].WorkDescription+'\n';
                      }
                    }
                    return res(wo);
                  }
                );
              }else{return res(wo);}
            }
          );
        }else{return res(wo);}
    })
}
var GETcustomer=(custcode,table='customertable')=>{
  return new Promise((res,rej)=>{
      let opts = {
          table:table,
          custcode:custcode
      };
      return res(SENDrequestapi(opts,'jmart'));
  })
}
var GETserviceitems=(custcode,table='custserviceitems')=>{
  return new Promise((res,rej)=>{
      let opts = {
          table:table,
          custcode:custcode
      };
      let sitems=[];
      SENDrequestapi(opts,'jmart').then(
        result=>{
          if(result.body.success){
            for(let i=0;i<result.body.table.length;i++){
                sitems.push(aserviceitem(result.body.table[i])); //aserviceitems()
            }
            let opts2 = {
                table:'test',
                option:'download',
                template:'AR_ServiceItemCustomInfo_tbl',
                where:[{OP:'=',CustomerCode:custcode}]
            };
            SENDrequestapi(opts2,'jmart').then(
              answr=>{
                if(answr.body.success){
                  for(let x=0,l=answr.body.table.length;x<l;x++){
                    for(let y=0,ll=sitems.length;y<ll;y++){
                      if(sitems[y].id===answr.body.table[x].LineNumber){
                        switch(answr.body.table[x].FieldNumber){
                          case "01":{sitems[y].filt1=answr.body.table[x].Information || '';}
                          case "02":{sitems[y].filt1q=answr.body.table[x].Information || '';}
                          case "03":{sitems[y].filt2=answr.body.table[x].Information || '';}
                          case "04":{sitems[y].filt2q=answr.body.table[x].Information || '';}
                          case "05":{sitems[y].beltsize=answr.body.table[x].Information || '';}
                          case "06":{sitems[y].controls=answr.body.table[x].Information || '';}
                          case "07":{sitems[y].refri=answr.body.table[x].Information || '';}
                          case "08":{sitems[y].elec=answr.body.table[x].Information || '';}
                        }
                      }
                    }
                  }
                }
                return res(sitems);
              }
            );
          }else{return res(sitems);}
        }
      );
  })
}

module.exports={
  GETjapitest,
  GETresflbook,
  GETscontract,
  GETwo,
  GETcustomer,
  GETserviceitems
}
