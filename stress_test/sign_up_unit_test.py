# does sign up rest call take empty password ????

import requests
import time
login_url = "http://ec2-54-208-152-167.compute-1.amazonaws.com/api/signup"
payload = {'username': 'zz','password': '1'}
# payload = {'username': 'tongmingleee', 'password': '1'}


for i in range(1):
    start = time.time()
    r = requests.post(login_url,data=payload)
    # r.content  # wait until full content has been transfered
    roundtrip = time.time() - start
    # print r.text

    if payload['username'] in r.text:
        print 'success'
    else:
        print 'fail'