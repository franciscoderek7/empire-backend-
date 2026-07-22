
function createVersion(documentId,data){

return {

document_id:documentId,

version:
1,

timestamp:
new Date()
.toISOString(),

data:data

};

}


module.exports={
createVersion
};

