class Product:

    def __init__(self,name,category,price,company):
        self.name=name
        self.category=category
        self.price=price
        self.company=company
        self.active=True

    def data(self):
        return {
            "name":self.name,
            "category":self.category,
            "price":self.price,
            "company":self.company,
            "active":self.active
        }
