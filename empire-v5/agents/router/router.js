
const registry =
require("../registry/agents.json");


function routeTask(task){

const text =
task.toLowerCase();


if(
text.includes("document") ||
text.includes("draft")
){

return "primedox";

}


if(
text.includes("security") ||
text.includes("threat")
){

return "omniguard";

}


if(
text.includes("market") ||
text.includes("opportunity")
){

return "gaphunter";

}


return "concierge";

}


function getAgent(id){

return registry.agents
.find(
agent=>agent.id===id
);

}


module.exports={
routeTask,
getAgent
};

