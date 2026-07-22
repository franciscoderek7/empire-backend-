def analyze_company(company):
    findings=[]

    if not company.website:
        findings.append("Website opportunity")

    findings.append("Automation review recommended")
    findings.append("Customer experience review recommended")

    return findings
