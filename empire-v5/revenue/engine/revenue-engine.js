
const fs=require("fs");

const file =
"./revenue/transactions/transactions.json";


function load(){

return JSON.parse(
fs.readFileSync(file)
);

}


function save(data){

fs.writeFileSync(
file,
JSON.stringify(data,null,2)
);

}


function recordSale(customer,product,amount){

let data=load();


data.transactions.push({

customer:customer,

product:product,

amount:amount,

status:"recorded",

time:
new Date()
.toISOString()

});


save(data);

}


function totalRevenue(){

let data=load();


return data.transactions
.reduce(
(sum,item)=>
sum+item.amount,
0
);

}


module.exports={
recordSale,
totalRevenue
};

