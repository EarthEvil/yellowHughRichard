import csv

# read user profile csv, parse each user into a map, and return list of users
def create_fake_users():
    fieldnames = ['first_name','last_name','phone_number','email','gender','birthday','income','address','username','password',]

    with open('names.csv', mode='r') as infile:
        reader = csv.DictReader(infile)
        users = []
        i = 0;
        for row in reader:
            user = {}
            for field in fieldnames:
                user.update({field:row[field]})
            print user
            users.append(user)

    return users

print create_fake_users()