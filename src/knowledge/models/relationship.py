class Relationship:

    def __init__(self,source,target,relation):
        self.source=source
        self.target=target
        self.relation=relation

    def data(self):
        return {
            "source":self.source,
            "target":self.target,
            "relation":self.relation
        }
