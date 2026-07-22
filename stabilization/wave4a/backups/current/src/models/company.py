class Company:
    def __init__(self,name,industry,website=""):
        self.name=name
        self.industry=industry
        self.website=website
        self.findings=[]

    def add_finding(self,finding):
        self.findings.append(finding)

    def summary(self):
        return {
            "name":self.name,
            "industry":self.industry,
            "website":self.website,
            "findings":self.findings
        }
