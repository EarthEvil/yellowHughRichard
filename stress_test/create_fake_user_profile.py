import random
from random import randint

import csv
from faker import Factory

fake = Factory.create('en_US')
gender_list = ['male', 'female','other']

def generate_gender():
    return random.choice(gender_list)

def generate_phone_number():
    return str(randint(1000000000, 9999999999))
def write_to_csv():
    users = generate_sign_up_user_profile()
    user = users[0]
    with open('names.csv', 'w') as csvfile:
        fieldnames = ['first_name','last_name','phone_number','email','gender','birthday','income','address','username','password',]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for user in users:
            writer.writerow(user)


def generate_sign_up_user_profile():
    users = []
    for i in range(10):
        user = {}
        user.update({'first_name': str(fake.first_name())})
        user.update({'last_name': str(fake.last_name())})
        user.update({'phone_number': generate_phone_number()})
        user.update({'email': str(fake.email())})
        user.update({'gender': str(generate_gender())})
        user.update({'birthday': str(fake.date(pattern="%Y-%m-%d"))})
        user.update({'income': str(fake.pyint())})
        s = str(fake.address()).replace('\n', '');
        user.update({'address': s})
        user.update({'username': str(fake.user_name())})
        user.update({'password': str(fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True))})
        # user.append(str(fake.last_name()))
        # user.append(str(fake.phone_number()))
        # user.append(str(fake.email()))
        # user.append(str(generate_gender()))
        # user.append(str(fake.date(pattern="%Y-%m-%d")))
        # user.append(str(fake.pyint()))
        # user.append(str(fake.address()))
        # user.append(str(fake.user_name()))
        # user.append(str(fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)))
        users.append(user)
    return users


write_to_csv()
#
# for i in range(100):
#     print pow(i, 100, 101)