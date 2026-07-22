class GapReport:

    def generate(self,opportunity):

        return {
            "title":
            "Gap Hunter Opportunity Report",

            "company":
            opportunity.company,

            "industry":
            opportunity.industry,

            "problem":
            opportunity.problem,

            "score":
            opportunity.score,

            "solution":
            "AI workflow improvement"
        }
