class AIProduct:

    def __init__(self,name,industry,price):
        self.name=name
        self.industry=industry
        self.price=price
        self.status="available"

    def data(self):
        return {
            "name":self.name,
            "industry":self.industry,
            "price":self.price,
            "status":self.status
        }


class Marketplace:

    def __init__(self):
        self.products=[]

    def add(self,product):
        self.products.append(product)

    def list(self):
        return [
            p.data()
            for p in self.products
        ]
