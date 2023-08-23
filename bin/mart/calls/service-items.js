
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
    serviceitem:({custcode=null},jmart)=>{
        return new Promise((resolve,reject)=>{
            let sitems = [];
            if(custcode){
                jmart.Request('sibycustcode','01',{
                    custcode:custcode,
                    option:'download'
                }).then(siresp=>{
                    if(siresp.isValid&&siresp.result.length){
                        for(let i=0;i<siresp.result.length;i++){
                            sitems.push(aserviceitem(siresp.result[i])); //aserviceitems()
                        }
                        jmart.Request('custom','01',{
                            option:'download',
                            template:'AR_ServiceItemCustomInfo_tbl',
                            where:[{OP:'=',CustomerCode:custcode}]
                        }).then(siinfo=>{
                            if(siinfo.isValid){
                                for(let x=0,l=siinfo.result.length;x<l;x++){
                                    for(let y=0,ll=sitems.length;y<ll;y++){
                                        if(sitems[y].id===siinfo.result[x].LineNumber){
                                            switch(siinfo.result[x].FieldNumber){
                                                case "01":{sitems[y].filt1=siinfo.result[x].Information || '';}
                                                case "02":{sitems[y].filt1q=siinfo.result[x].Information || '';}
                                                case "03":{sitems[y].filt2=siinfo.result[x].Information || '';}
                                                case "04":{sitems[y].filt2q=siinfo.result[x].Information || '';}
                                                case "05":{sitems[y].beltsize=siinfo.result[x].Information || '';}
                                                case "06":{sitems[y].controls=siinfo.result[x].Information || '';}
                                                case "07":{sitems[y].refri=siinfo.result[x].Information || '';}
                                                case "08":{sitems[y].elec=siinfo.result[x].Information || '';}
                                            }
                                        }
                                    }
                                } 
                            }
                            return resolve({
                                success:true,
                                msg:'Service Items',
                                results:sitems
                            })
                        })
                    }else{
                        return resolve({
                            success:false,
                            msg:'Jonas Request Failes',
                            result:null
                        })
                    } 
                })
            }else{
                return resolve({
                    success:false,
                    msg:'No custcode given',
                    result:null
                });
            }
        });
    }
}