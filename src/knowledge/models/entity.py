class Entity:

    def __init__(self,name,entity_type):
        self.name=name
        self.entity_type=entity_type

    def data(self):
        return {
            "name":self.name,
            "type":self.entity_type
        }
