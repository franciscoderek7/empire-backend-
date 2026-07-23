
const services =
require("./config/services.json");


function routeRequest(path){

let service =
services.services.find(
s=>path.startsWith(s.route)
);


if(!service){

return {

status:404,

message:"Service not found"

};

}


return {

status:200,

service:service.name

};

}


module.exports={
routeRequest
};

