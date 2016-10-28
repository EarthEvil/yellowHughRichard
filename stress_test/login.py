import requests
import time
login_url = "http://ec2-54-208-152-167.compute-1.amazonaws.com/api/signin"
payload = {'username': 'testtest', 'password': '1'}


for i in range(1):
    start = time.time()
    r = requests.post(login_url,data=payload)
    r.content  # wait until full content has been transfered
    roundtrip = time.time() - start
    print roundtrip



print r.text