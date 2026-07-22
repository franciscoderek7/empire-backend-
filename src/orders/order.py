class Order:

    def __init__(self,customer,product):
        self.customer=customer
        self.product=product
        self.status="created"

    def activate(self):
        self.status="active"

    def data(self):
        return {
            "customer":self.customer,
            "product":self.product,
            "status":self.status
        }
