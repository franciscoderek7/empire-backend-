PLANS={

"starter":{
"setup":499,
"monthly":49
},

"professional":{
"setup":2499,
"monthly":199
},

"enterprise":{
"setup":"custom",
"monthly":"custom"
}

}


def get_plan(name):
    return PLANS.get(name)
