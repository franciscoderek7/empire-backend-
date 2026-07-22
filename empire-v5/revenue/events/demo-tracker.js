
const fs=require("fs");


const file =
"revenue/events/demo-events.json";


function recordDemo(event){

let data={
 events:[]
};


if(fs.existsSync(file)){

data=
JSON.parse(
fs.readFileSync(file)
);

}


data.events.push({

type:event,

time:
new Date()
.toISOString()

});


fs.writeFileSync(
file,
JSON.stringify(
data,
null,
2
)
);


}


module.exports={
recordDemo
};

