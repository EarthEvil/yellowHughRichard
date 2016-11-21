import requests
import json
import random
import os

from faker import Faker
fake = Faker()
path = "/home/apple/Desktop/Senior/yellowHughRichard-master/stress_test/user_information"
def random_gender():
	sex = ['Male', 'Female', 'Other']
	return random.choice(sex)
for x in range(0, 100):
	first_name = fake.first_name();
	last_name = fake.last_name();
	phone_number = fake.random_number(digits = 10);
	email = fake.email();
	gender = random_gender();
	date_of_birth =fake.date();
	income = fake.random_number();
	address = fake.address();
	username = first_name + fake.password(length=5,digits=True, upper_case=True, lower_case=True)
	password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)
	payload = {
		"first_name": first_name,
		"last_name": last_name,
		"phone_number":phone_number,
		"email":email,
		"gender":gender,
		"date_of_birth":date_of_birth,
		"income":income,
		"address":address,
		"username":username,
		"password": password
	}	
	
	file_name = username +'.json'
	with open(os.path.join(path, file_name), 'w') as f:
    		json.dump(payload, f)


"""
def random_gender():
	sex = ['Male', 'Female', 'Other']
	return random.choice(sex)
for x in range(0, 2):
	user_information = []
	first_name = fake.first_name();
	last_name = fake.last_name();
	phone_number = fake.phone_number();
	email = fake.email();
	gender = random_gender();
	date_of_birth =str(fake.date());
	income = fake.random_number();
	address = fake.address();
	username = first_name + fake.password(length=5,digits=True, upper_case=True, lower_case=True)
	password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)
	user_information.append(first_name);
	user_information.append(last_name);
	user_information.append(phone_number);
	user_information.append(email);
	user_information.append(gender);
	user_information.append(date_of_birth);
	user_information.append(income);
	user_information.append(address);
	user_information.append(username);
	user_information.append(password);
"""

