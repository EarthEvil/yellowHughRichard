import requests
import time
import string
import random


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

firstname="a"
lastname="a"
userName=id_generator()
Email="a@udel.edu"
Password=id_generator()
ConfirmPassword=Password

f = open('userinfo.txt', 'a+')
f.write(userName+'\n'+Password+'\n')
f.close()








login_url="http://ec2-54-208-152-167.compute-1.amazonaws.com/api/signup"
payload = {
	"first_name": firstname,
	"last_name": lastname,
	"username": userName,
	"email": Email,
	"password": Password,
	"confirmPassword": ConfirmPassword
}	
session_requests = requests.session()
result = session_requests.get(login_url)
result = session_requests.post(
	login_url, 
	data = payload
)
# print (result.status_code)









login_url = "http://ec2-54-208-152-167.compute-1.amazonaws.com/api/signin"





f = open('userinfo.txt', 'r')





while True:
	userin=""
	passin=""
	userin=f.readline().rstrip('\n') 
	print userin
	passin=f.readline().rstrip('\n') 
	print passin
	
	
	payload = {'username': userin, 'password': passin}
	if (passin):
		start = time.time()
		r = requests.post(login_url,data=payload)
		r.content  # wait until full content has been transfered
		roundtrip = time.time() - start
		# print roundtrip
	
	if (not (passin)):
		break
	
f.close()



print(" ")
print(" ")
print(" ")
print(" ")
print(" ")
print(" ")
print(" ")
print(" ")
# print(id_generator());
# print r.status_code
# print r.text
