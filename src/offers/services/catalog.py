class Catalog:

    def __init__(self):
        self.products=[]

    def add(self,product):
        self.products.append(product)

    def list(self):
        return [
            p.data()
            for p in self.products
        ]
