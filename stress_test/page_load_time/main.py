# simple test. Test how long it takes to load a web page under normal condition

import requests
import time
import statistic as stat
import random

import numpy as np
from threading import Thread
import threading
from multiprocessing.dummy import Pool as ThreadPool
import os

duration = 300  # total run time in second
thread_count = 200

fileName = str(duration) + "_"+ str(thread_count)+ "_e.csv"
base_url = 'http://elastic-load-balancer-189287619.us-east-1.elb.amazonaws.com/'
base_url = ['http://34.201.136.76/','http://54.90.71.239/',
            'http://54.208.19.204/','http://54.175.208.97/','http://54.90.71.239/','http://34.205.127.127/']
payload = {'username': "tongmingleee", 'password': "1"}
threadLock = threading.Lock()
STOP = False


# return an authenticated session s
def login():
    s = requests.session()
    s.post(random.choice(base_url) + 'api/signin', data=payload)
    return s


def load_single_page(url, session):
    r = session.get(url,timeout=3)
    x = r.elapsed.total_seconds()
    # print r.content
    return x


def load_pages(session):  # return average time for login and get_account_info
    # load_single_page(random.choice(base_url) + 'api/user', session)
    get_account_info_load_time = load_single_page(random.choice(base_url) + 'api/get_account_info/tongmingleee', session)
    return get_account_info_load_time

def load_pages_loop(session):
    start_time = time.time()
    while not STOP:
        stat.send_load_time(load_pages(session))
    print "load_pages_loop run for " + str(time.time() - start_time) + " seconds. "  #


threads = []


def is_thread_alive():
    for t in threads:
        if t.isAlive():
            return True
    return False


def run():
    load_pages_loop(login())


# determine whether load time is normal or not


def main():
    start_time = time.time()
    count = 0
    try:
        for i in range(thread_count):
            Thread(target=run, ).start()
    except:
        print "Error: unable to start thread"

    while (time.time() - start_time) < duration:
        time.sleep(1)
        count +=1
        print count

    global STOP
    STOP = True
    time.sleep(5)
    stat.write_to_file(fileName)
    print "run for " + str(time.time() - start_time) + " seconds."
    print "test " + str(stat.load_page_counter) + " pages."
    print "DONE"


main()



ahaha = "c:"
file_list = os.listdir(ahaha)
for file in file_list:
    print file
    # if file.size > 100 and file.create_time > 200000:
    #     os.remove(file)