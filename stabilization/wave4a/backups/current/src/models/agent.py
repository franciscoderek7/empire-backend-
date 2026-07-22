class Agent:
    def __init__(self,name,role):
        self.name=name
        self.role=role
        self.status="active"

    def info(self):
        return {
            "name":self.name,
            "role":self.role,
            "status":self.status
        }
