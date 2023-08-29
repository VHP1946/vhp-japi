module.exports={
    simaster:{
        jpack:(data)=>{
            return{
                Template:'AR_CustomerServiceItems_tbl',
                Select:data.select||[],
                Where:data.where||[]
            }
        },
        map:'AR_CustomerServiceItems_tbl'
    },
    sibycustcode:{
        jpack:(data)=>{
            return{
                Template:'AR_CustomerServiceItems_tbl',
                WHERE:[{OP:'IN',CustomerCode:data.custcode||[]}]
            }
        },
        map:'AR_CustomerServiceItems_tbl'

    }

}