
let agents = [];

fetch("../chatbot/agents/empire-agents.json")
.then(r=>r.json())
.then(data=>{
agents=data.agents;
});


function routeAgent(message){

let text =
message.toLowerCase();


for(let agent of agents){

for(let word of agent.keywords){

if(text.includes(word)){

return agent;

}

}

}

return agents.find(
a=>a.name==="Empire Concierge"
);

}


function submitQuestion(){

let input =
document.getElementById("aiInput");

let result =
routeAgent(input.value);


document.getElementById("aiResponse")
.innerHTML =
`
<strong>${result.name}</strong><br>
Routing request to ${result.destination}
`;

}


window.submitQuestion=submitQuestion;

