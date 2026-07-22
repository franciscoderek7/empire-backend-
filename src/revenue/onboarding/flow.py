class Onboarding:

    def __init__(self,customer):
        self.customer=customer
        self.steps=[]

    def add_step(self,step):
        self.steps.append(step)

    def checklist(self):
        return {
            "customer":self.customer,
            "steps":self.steps
        }
