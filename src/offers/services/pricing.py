class PricingEngine:

    def discount(self,price,percent):
        return price-(price*(percent/100))

    def monthly_value(self,monthly):
        return monthly*12
