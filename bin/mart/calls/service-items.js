
let aserviceitem = (si)=>{
    if(!si || si==undefined){
        si = {};
    }
    return {
        custcode:si.custcode || '',
        id: si.id || '',
        tagid: si.tagid || '',
        type: si.type || '',
        status: si.status || '',
        area: si.area || '',
        location: si.location || '',
        descr: si.descr || '',
        manf: si.manf || '',
        model: si.model || '',
        serial: si.serial || '',
        insdate: si.insdate || '',
        manfdate:si.manfdate||'',
        warr1: si.warr1 || '',
        warr2: si.warr2 || '',
        warr3: si.warr3 || '',
        filt1:  si.filt1 || '',
        filt1q: si.filt1q || '',
        filt2: si.filt2 || '',
        filt2q: si.filt2q || '',
        beltsize: si.beltsize || '',
        controls: si.controls || '',
        refri: si.refri || '',
        elec: si.elec || '',
    }
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
                    console.log('Service Response >',siresp);
                    if(siresp.isValid&& siresp.result && siresp.result.length){
                        for(let i=0;i<siresp.result.length;i++){
                            sitems.push(aserviceitem(siresp.result[i])); //aserviceitems()
                        }
                        jmart.Request('custom','01',{
                            option:'download',
                            template:'AR_ServiceItemCustomInfo_tbl',
                            select:[

                            ],
                            where:[
                                {OP:'IN',CustomerCode:custcode}
                            ]
                        }).then(siinfo=>{
                            if(siinfo.isValid){
                                for(let x=0,l=siinfo.result.length;x<l;x++){
                                    for(let y=0,ll=sitems.length;y<ll;y++){
                                        try{
                                            if(sitems[y].custcode === siinfo.result[x].CustomerCode && sitems[y].id===siinfo.result[x].LineNumber){
                                                switch(siinfo.result[x].FieldNumber){
                                                    case "01":{sitems[y].filt1=siinfo.result[x].Information || '';}
                                                    case "02":{sitems[y].filt1q=siinfo.result[x].Information || '';break;}
                                                    case "03":{sitems[y].filt2=siinfo.result[x].Information || '';break;}
                                                    case "04":{sitems[y].filt2q=siinfo.result[x].Information || '';break;}
                                                    case "05":{sitems[y].beltsize=siinfo.result[x].Information || '';break;}
                                                    case "06":{sitems[y].controls=siinfo.result[x].Information || '';break;}
                                                    case "07":{sitems[y].refri=siinfo.result[x].Information || '';break;}
                                                    case "08":{sitems[y].elec=siinfo.result[x].Information || '';break;}
                                                }
                                            }
                                        }catch{console.log('bad linnumber',siinfo.result[x])}
                                    }
                                } 
                            }
                            return resolve({
                                success:true,
                                msg:'Service Items',
                                result:sitems
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