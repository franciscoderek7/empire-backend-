class RevenueTracker:
    def __init__(self):
        self.revenue=0

    def add(self,value):
        self.revenue += value

    def total(self):
        return self.revenue
