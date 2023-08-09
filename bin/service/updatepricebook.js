
var afbookitem=(fbi={})=>{
    if(!fbi){fbi={}}
    return{
      book:fbi.FlatRateBookCode || '',
      task:fbi.TaskID || '',
      descr:fbi.Description || '',
      pl:fbi.PriceLevelCode ||'',
      price:fbi.SellingPrice || ''
    }
  }
  var UPDATEfbook=(pak)=>{
    return new Promise((resolve,reject)=>{
      let fbdescopts={
          table:'custom',
          option:'download',
          template:'WO_FlatRateBookHeader_tbl'
  
      }
      let fbpriceopts={
          table:'custom',
          option:'download',
          template:'WO_FlatRateBookPricing_tbl'
      }
      console.log(pak);
      console.log('UPDATING THE FLATRATEBOOK')
      pak.data.pack=fbdescopts
      GETj2vtable(pak).then(//get description table
        tres=>{
          let dtable = pak.body.table;
          if(tres){
            pak.data.pack=fbpriceopts;
            pak.body={};
            GETj2vtable(pak).then(
              pres=>{
                let ptable = pak.body.table;
                if(pres){
                  for(let x=0;x<ptable.length;x++){
                    for(let y=0;y<dtable.length;y++){
                      if(ptable[x].TaskID===dtable[y].TaskID && ptable[x].FlatRateBookCode===dtable[y].FlatRateBookCode){
                        ptable[x].Description=dtable[y].Description1+(dtable[y].Description2?dtable[y].Description2:'');
                        ptable[x]=afbookitem(ptable[x]);
                        break;
                      }
                    }
                  }
                  pak.body=ptable;
                  //console.log(path.join(__dirname,'../../../data/store/jonas/SERVICE/jfbook.db'));
                  ptable.push({task:'updated',date:new Date().toISOString()});
                  let jbook = new NEDBconnect(path.join(__dirname,'../../../data/store/jonas/SERVICE/jfbook.db'));
                  jbook.REMOVEdoc({},true).then(
                    rdocs=>{
                      //console.log(rdocs);
                      jbook.INSERTdb(ptable).then(
                        indocs=>{console.log(indocs)}
                      );
                    }
                  )
                  //store ptable in datamart
  
                return resolve(true);
                }else{return resolve(false);}
              }
            )
          }
          else{return resolve(false);}
        }
      )
    });
  }
  