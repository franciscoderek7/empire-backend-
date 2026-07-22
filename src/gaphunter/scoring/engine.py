class GapScore:

    def calculate(
        self,
        impact,
        urgency,
        automation
    ):

        return (
            impact +
            urgency +
            automation
        ) / 3
