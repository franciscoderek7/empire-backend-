
const fs=require("fs");


function logEvent(event,data){

const record={

event:event,

data:data,

time:new Date()
.toISOString()

};


fs.appendFileSync(

"core/logs/events.log",

JSON.stringify(record)+"\n"

);

}


module.exports={logEvent};

