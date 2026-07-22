class ResearchQueue:
    def __init__(self):
        self.items=[]

    def add(self,item):
        self.items.append(item)

    def list(self):
        return self.items
