class Opportunity:
    def __init__(self,title,value):
        self.title=title
        self.value=value

    def score(self):
        return self.value
