
const bus =
require("../core/events/eventBus");


const logger =
require("../core/logs/eventLogger");


bus.on(
"payment.completed",
(data)=>{

logger.logEvent(
"payment.completed",
data
);

}
);


bus.on(
"lead.created",
(data)=>{

logger.logEvent(
"lead.created",
data
);

}
);


bus.on(
"security.alert",
(data)=>{

logger.logEvent(
"security.alert",
data
);

}
);


module.exports=bus;

