- [Brief](#brief)
- [Setup](#setup)
- [Uses](#uses)
- [Requests](#requests)

## Brief
This is a server to better interface with the JONAS api. The server will handle:
- A direct mart interface (interact with one table at a time)
- join call interface (assemble calls to multiple tables to form 1 object)

- routes that accomplish a task and need the mart **FOR NOW** (tasks that use or need the tables to accomplish them) **Can move these routes to the 'Service' server, and use JAPI

## Setup


## Uses

## Requests
Requests to this server follow the same core structure as the other vhp servers:
`
{
    access:{
        coid:String,
        user:String,
        pswrd:String,
        request:String
    },
    pack:{< Dependant on request >}
}
`
coid - determines which company you want to query from. ex -> ('01')
user - not used **could be
pswrd - not used **could be
request - describes the contents of package -> [JMart](#jmart), [JCall](#jcall)


### JMart
Jmart is used for quering available Jonas tables directly. These tables are declared in the modeling files held in the 'bin/mart/models/' folder.

- JONAS internal use pack -`
{
    WebMethod:String,
    CompanyCode:String,
    Option:String,
    Template:String,
    SELECT:Array,
    WHERE:Array
}
`
- Request Pack - `
{
    table:String,
    option:String,
    template:String,
    select:Array,
    where:Array
}
`
- table - The available tables are found in 'bin/mart/models/schemes' folder. 
- option - 'download' OR 'template'
- template - is decided by the table unless the table is 'custom'. Is the Jonas table name.
- select - A way to limit the data returned. The fields name must match the fields in jonas, and can be in the 'bin/mart/models/maps' folder.
- where - A way to pass filters. This is an area of intrest as we do not stray to far from the below example. As more are tested, they will be added. 

#### maps
Maps are used to convert the incoming tables to variable names used in an app. These can be added as json files, one table per file. The file name can be whatever, but the 'required' name needs to match the Jonas table name it links to.

Map Structure
`
{
    "WorkOrderNumber": "id",
    "CustomerCode": "custcode",
    "PhoneNumber": "contactphone",
    "ContactName": "contactname",
}
`
The property matches the Jonas name, and the value matches the application. Maps act similar to 

#### schemes / tables
Schemes can be created / modified by attaching them to the module.exports{} in jmodels.js. When attaching tables, the function name is used as the 'call' name (case does not matter).

Scheme Structure
`
{
    jpack:(data)=>{
        /*
            some code
        */
        return{
            Option:'download',
            Template:'WO_SC_ServiceContractMaster_tbl',
            WHERE:[{OP:'=',CustomerCode:data.custcode||''}]
        }
    },
    map:'WO_SC_ServiceContractMaster_tbl' 
}
`
- jpack - 
is a function that is passed 'data'. Data can hold a standard request pack that maps directly, OR any addition information to create a standard pack. In the above structure example you can see data.custcode used as an argument of WHERE.

- map - 
Name of a linked map. If there is no map a null can be passed.

Following are examples of available schemes used in this system. The headers match the 'call' value (table:'scheme'), so the property will be left out of the request pack.
In addition, 'option' will be needed to determine 'template OR 'download'. It to will be left out of the below pack descriptions, but is always default to 'template'.

GENERIC MODELS - (genericModels.js)
#### custom
`
{
    < contains a fields in the standard pack >
}
`
When using the custom pack, remember, you are addressing the actual table by the jonas name, and passed to Template.

CUSTOMER MODELS - (customerModels.js)
#### customermaster
`
{
    custcode:String
}
`

SERVICE ITEM MODELS - (serviceitemModels.js)
#### simaster
`
{
    select:Array,
    where:Array
}
`
both defaults are []

#### sibycustcode
`
{
    custcode:String
}
`

SERVICE MODELS - (serviceModels.js)
#### womaster
`
{
    where:Array
    select:Array
}
`
Select - is optional, with the SELECTwo holding the default.

#### wobynumber
`
{
    wonum:String
    select:Array
}
`
Wonum - It is important to format the wonum correctly. The Jonas system needs the 'zeros' in front of the number. The total character count is 8 ('00036435').
Select - follow the SELECTwo default.

#### wobydate
`
{
    range:Array
    select:Array
}
`
Range - is passed as an array holding [ Range Start, Range End], and is defaulted to today. In order to search one day, the same date can be passed in the start and end array spots.
Select - follow the SELECTwo default.

#### flatratebook
`
{
    bookcode:String
}
`
Bookcode - a way to search the 

CONTRACT MODELS - (contractModels.js)
#### SCmaster
`
{
    select:Array,
    where:Array
}
`
both of the above defaults are empty strings. As we start to deal with contracts it will get a proper default array

#### SCbyCumster
`
{
    custcode:String
}
`
Will return all of the customers contractss regardless of status. Again, this can be expanded.



### JCall
Calls are queries that require more than one table requesrt to form an object. Call names can not match the JMart tables already setup. To retrieve information from the calls send the call name to 'table' in the pack.


#### jticket
`
{
    table:'jticket',
    wonum:String
}
`
It is important to format the wonum correctly. The Jonas system needs the 'zeros' in front of the number. The total character count is 8 ('00036435').





