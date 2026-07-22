import json
import os

def save(data,path):

    os.makedirs(
        os.path.dirname(path),
        exist_ok=True
    )

    with open(path,"w") as f:
        json.dump(
            data,
            f,
            indent=2
        )
