import json
import datetime

FILE="data/audit/events.json"


def write(event):

    try:
        with open(FILE) as f:
            logs=json.load(f)
    except:
        logs=[]

    logs.append({
        "time":str(datetime.datetime.now()),
        "event":event
    })

    with open(FILE,"w") as f:
        json.dump(
            logs,
            f,
            indent=2
        )
