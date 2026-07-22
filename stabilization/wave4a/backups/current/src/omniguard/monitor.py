class Monitor:
    def __init__(self):
        self.events=[]

    def record(self,event):
        self.events.append(event)

    def status(self):
        return len(self.events)
