class RevenueTracker:

    def __init__(self):
        self.sales=[]

    def record(self,amount):
        self.sales.append(amount)

    def total(self):
        return sum(self.sales)
