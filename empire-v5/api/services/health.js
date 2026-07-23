
function check(service){

return {

service:service,

status:"online",

time:
new Date()
.toISOString()

};

}


module.exports={
check
};

