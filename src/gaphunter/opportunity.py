class Opportunity:

    def __init__(
        self,
        company,
        industry,
        problem,
        impact
    ):
        self.company=company
        self.industry=industry
        self.problem=problem
        self.impact=impact
        self.score=0

    def calculate_score(self):

        self.score = (
            self.impact * 10
        )

        return self.score

    def data(self):

        return {
            "company":self.company,
            "industry":self.industry,
            "problem":self.problem,
            "impact":self.impact,
            "score":self.score
        }
