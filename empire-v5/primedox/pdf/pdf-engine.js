
const fs=require("fs");


function createDocument(title,content){

return {

title:title,

content:content,

created:
new Date()
.toISOString(),

status:"generated"

};

}


function saveDocument(document){

const file =
`primedox/vault/${Date.now()}.json`;

fs.writeFileSync(
file,
JSON.stringify(
document,
null,
2
)
);

return file;

}


module.exports={
createDocument,
saveDocument
};

