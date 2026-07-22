class Pipeline:
    def __init__(self):
        self.leads=[]

    def add(self,lead):
        self.leads.append(lead)

    def count(self):
        return len(self.leads)
