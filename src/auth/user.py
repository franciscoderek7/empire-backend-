class User:

    def __init__(self,name,email,role="demo"):
        self.name=name
        self.email=email
        self.role=role
        self.active=True

    def data(self):
        return {
            "name":self.name,
            "email":self.email,
            "role":self.role,
            "active":self.active
        }
