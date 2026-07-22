class DemoAccess:

    def __init__(self):
        self.mode="demo"

    def show(self):

        return {
            "access":self.mode,
            "limited":True
        }
