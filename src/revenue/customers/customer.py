class Customer:

    def __init__(
        self,
        company,
        plan
    ):
        self.company=company
        self.plan=plan
        self.status="pending"

    def activate(self):
        self.status="active"

    def data(self):
        return {
            "company":self.company,
            "plan":self.plan,
            "status":self.status
        }
