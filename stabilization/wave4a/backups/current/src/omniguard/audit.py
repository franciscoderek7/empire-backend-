import datetime

def audit(event):
    with open("logs/security/events.log","a") as f:
        f.write(f"{datetime.datetime.now()} {event}\n")
