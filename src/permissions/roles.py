ROLES={

"demo":[
"view_demo"
],

"customer":[
"view_paid_features",
"create_projects"
],

"admin":[
"view_all",
"manage_agents",
"manage_system"
],

"agent":[
"execute_workflows"
]

}


def allowed(role,permission):

    return permission in ROLES.get(
        role,
        []
    )
