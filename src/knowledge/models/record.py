import datetime

class KnowledgeRecord:

    def __init__(self,topic,content):
        self.topic=topic
        self.content=content
        self.created=str(datetime.datetime.now())

    def data(self):
        return {
            "topic":self.topic,
            "content":self.content,
            "created":self.created
        }
