import requests
import json
import random
import os
import time
import MySQLdb


path = "/home/apple/Desktop/Senior/yellowHughRichard-master/stress_test/user_information"
signup_url="http://localhost:3000/api/signup"

json_files = [pos_json for pos_json in os.listdir(path) if pos_json.endswith('.json')]
print json_files  
total_time = 0
for js in json_files:
    with open(os.path.join(path, js)) as json_file:
    	data = json.load(json_file)
	get_info_url = "http://localhost:300/api/get_account_info/" + data["username"]
	payload = {
		"first_name": data["first_name"],
		"last_name": data["last_name"],
		"phone_number":data["phone_number"],
		"email":data["email"],
		"gender":data["gender"],
		"date_of_birth":data["date_of_birth"],
		"income":data["income"],
		"address":data["address"],
		"username":data["username"],
		"password":data["password"]
	}
	start = time.time();
	session_requests = requests.session()
	result = session_requests.get(signup_url)
	result = session_requests.post(
		signup_url, 
		data = payload
	)
	single_roundtrip = time.time() - start;
	total_time = single_roundtrip + total_time;
	

print(total_time)
