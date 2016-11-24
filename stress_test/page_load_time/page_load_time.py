# simple test. Test how long it takes to load a web page under normal condition

import requests
import time
import numpy as np

repetition = 10

# return an authenticated session s
def login():
    payload = {'username': "tongmingleee",'password':"1"}
    s = requests.session()
    s.post('http://ec2-54-85-60-93.compute-1.amazonaws.com/api/signin',data=payload)
    return s


def load_page(url, session):
    load_time = []
    for i in range(repetition):
        start_time = time.time()
        r = session.get(url)
        x = r.elapsed.total_seconds()
        load_time.append(x)
    # print r.content
    print 'Finished loading page:'

    return load_time

# determine whether load time is normal or not

# print statistic of load time
def stat(load_time_array):
    print load_time_array
    print 'count: ', len(load_time_array)
    print 'mean: ', np.mean(load_time_array)
    print 'median: ', np.median(load_time_array)
    print 'std: ', np.std(load_time_array)
    print '\n'

def main():
    base_url = 'http://ec2-54-85-60-93.compute-1.amazonaws.com/'

    # log in first
    session = login();

    # test how long it takes to load log in page
    print 'loading login page...'
    login_load_time = load_page(base_url,session);
    stat(login_load_time)

    # test how long it takes to load sign up page
    print 'loading sign up page...'
    signup_load_time = load_page(base_url+'signup',session)
    stat(signup_load_time)

    # test how long it takes to load home page
    print 'loading home page...'
    home_load_time = load_page(base_url+'index',session)
    stat(home_load_time)

# test how long it takes to load home page
    print 'loading debit page...'
    debit_load_time = load_page(base_url+'debit',session)
    stat(debit_load_time)

    # test how long it takes to load home page
    print 'loading deposit page...'
    deposit_load_time = load_page(base_url+'deposit',session)
    stat(deposit_load_time)

    # test how long it takes to load home page
    print 'loading accountManagement page...'
    accountManagement_load_time = load_page(base_url+'accountManagement',session)
    stat(accountManagement_load_time)

    # test how long it takes to load home page
    print 'loading location page...'
    location_load_time = load_page(base_url+'location',session)
    stat(location_load_time)

    # test how long it takes to load home page
    print 'loading profile page...'
    profile_load_time = load_page(base_url+'profile',session)
    stat(profile_load_time)

main()


