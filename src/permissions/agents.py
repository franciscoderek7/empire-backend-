class AgentPermission:

    def __init__(self,name,tools):
        self.name=name
        self.tools=tools

    def can_use(self,tool):
        return tool in self.tools


DEFAULT_AGENTS={

"PrimeDox":[
"documents",
"workflows",
"knowledge"
],

"GapHunter":[
"research",
"analysis"
],

"OmniGuard":[
"monitoring",
"audit"
]

}
