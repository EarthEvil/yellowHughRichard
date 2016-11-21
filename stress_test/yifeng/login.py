
import requests
from lxml import html
import os
import json
import time

login_url="http://localhost:3000/api/signin"
path = "/home/apple/Desktop/Senior/yellowHughRichard-master/stress_test/user_information"
total_time = 0
json_files = [pos_json for pos_json in os.listdir(path) if pos_json.endswith('.json')]
count = 0
success = 0
for js in json_files:
    with open(os.path.join(path, js)) as json_file:
	count = count + 1;
	data = json.load(json_file)
	payload = {
		"username":data["username"],
		"password":data["password"]
	}
	start = time.time();
	session_requests = requests.session()
	result = session_requests.get(login_url)
	result = session_requests.post(
		login_url, 
		data = payload
	)
	single_roundtrip = time.time() - start;
	total_time = single_roundtrip + total_time;
	if payload["username"] in result.text:
		success = success + 1;
	else:
		print(data["username"])
if(success == count):
	print("success")
print(total_time)
"""
#get the information from the web by using Xpath

result_2 = session_requests.get(
	url
)

tree = html.fromstring(result_2.content)
user = tree.xpath('//div[@class="col s6"]//h4/text()')

#compare the result if they are the same, then you successfully log in, and information is intact.
print user[0]
print payload["username"]
if(user[0] == payload["username"]):
	print("success")
if(user[0] != payload["username"]):
	print("fail")
"""

