class Memory:
    def __init__(self):
        self.data=[]

    def store(self,item):
        self.data.append(item)

    def retrieve(self):
        return self.data
