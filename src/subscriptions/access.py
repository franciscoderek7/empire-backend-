class Subscription:

    def __init__(self,user,plan):
        self.user=user
        self.plan=plan
        self.status="active"

    def has_access(self):
        return self.status=="active"
