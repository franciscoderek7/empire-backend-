class CheckoutBuilder:

    def create(self,product):
        return {
            "product":product.name,
            "payment_required":True,
            "status":"ready"
        }
