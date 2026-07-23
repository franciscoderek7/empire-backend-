
const fs=require("fs");


const eventsFile =
"./bus/events/events.json";

const messagesFile =
"./bus/messages/messages.json";


function append(file,item){

let data =
JSON.parse(
fs.readFileSync(file)
);


data.push(item);


fs.writeFileSync(
file,
JSON.stringify(data,null,2)
);

}


function publish(type,payload){

append(
eventsFile,
{
type:type,
payload:payload,
time:
new Date().toISOString()
}
);

}


function send(from,to,message){

append(
messagesFile,
{
from:from,
to:to,
message:message,
time:
new Date().toISOString()
}
);

}


module.exports={
publish,
send
};

