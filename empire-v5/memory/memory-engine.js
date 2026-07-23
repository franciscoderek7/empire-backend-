
const fs=require("fs");


const eventsFile =
"./memory/events/events.json";


function remember(event){

let data={
 events:[]
};


if(fs.existsSync(eventsFile)){

data=
JSON.parse(
fs.readFileSync(eventsFile)
);

}


data.events.push({

event:event,

timestamp:
new Date()
.toISOString()

});


fs.writeFileSync(
eventsFile,
JSON.stringify(data,null,2)
);

}


function recall(){

return JSON.parse(
fs.readFileSync(eventsFile)
);

}


module.exports={
remember,
recall
};

