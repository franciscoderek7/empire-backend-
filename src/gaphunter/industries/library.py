INDUSTRIES={

"construction":{
"problems":[
"manual paperwork",
"slow estimates",
"communication delays"
]
},

"automotive":{
"problems":[
"lead followup",
"inventory management",
"customer communication"
]
},

"real_estate":{
"problems":[
"market research",
"lead management",
"document workflows"
]
}

}


def get_industry(name):

    return INDUSTRIES.get(
        name,
        {}
    )
