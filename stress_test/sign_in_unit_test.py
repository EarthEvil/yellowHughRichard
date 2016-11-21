# does sign up rest call take empty password ????

import requests
import time
from parse_user_profile import create_fake_users
login_url = "http://ec2-54-208-152-167.compute-1.amazonaws.com/api/signin"
# payload = {'username': 'tongmingleee', 'password': '1'}

users = create_fake_users()
print users
#
for user in users:
    start = time.time()
    payload = {'username': user['username'],'password': user['password']}
    r = requests.post(login_url,data=payload)
    # r.content  # wait until full content has been transfered
    roundtrip = time.time() - start
    # print r.text

    if payload['username'] in r.text:
        print 'success'
    else:
        print 'fail'