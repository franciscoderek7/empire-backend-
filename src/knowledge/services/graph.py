class KnowledgeGraph:

    def __init__(self):
        self.entities=[]
        self.relationships=[]

    def add_entity(self,entity):
        self.entities.append(entity)

    def add_relationship(self,relationship):
        self.relationships.append(relationship)

    def summary(self):
        return {
            "entities":len(self.entities),
            "relationships":len(self.relationships)
        }
