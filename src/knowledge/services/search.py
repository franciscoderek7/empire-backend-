class KnowledgeSearch:

    def __init__(self):
        self.records=[]

    def add(self,record):
        self.records.append(record)

    def find(self,keyword):
        return [
            r.data()
            for r in self.records
            if keyword.lower()
            in r.content.lower()
        ]
