import datetime

def status():
    return {
        "system":"FHI Empire",
        "time":str(datetime.datetime.now()),
        "state":"operational"
    }
