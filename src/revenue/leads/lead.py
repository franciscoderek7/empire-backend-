class Lead:

    def __init__(
        self,
        name,
        company,
        industry
    ):
        self.name=name
        self.company=company
        self.industry=industry
        self.status="new"

    def qualify(self):
        self.status="qualified"

    def data(self):
        return {
            "name":self.name,
            "company":self.company,
            "industry":self.industry,
            "status":self.status
        }
