import numpy as np
import csv
import pandas as pd


path = 'result.xlsx'
results = []
load_page_counter = 0
load_time_array = []


def send_load_time(single_load_time):
    if not single_load_time > 2:
        load_time_array.append([single_load_time])

# print statistic of load time
def stat_summary():
    # print load_time_array
    count = len(load_time_array)
    total_time = np.sum(load_time_array)
    mean = np.mean(load_time_array)
    median = np.median(load_time_array)
    std = np.std(load_time_array)
    results.append([count, total_time,mean,median,std])

def reject_outliers(data, m=2):
    return data[abs(data - np.mean(data)) < m * np.std(data)]

default_file_name = "result.csv"
def write_to_file(filename):

    # remove outlier
    # load_time_array_clean= reject_outliers(load_time_array)
    global load_page_counter
    load_page_counter = len(load_time_array)
    """
    Write data to a CSV file path
    """
    # print results

    with open(filename, "wb") as csv_file:
        writer = csv.writer(csv_file, delimiter=',')
        for line in load_time_array:
            writer.writerow(line)

    # """
    # Write data to a xlsx file path
    # """
    #
    # df = pd.DataFrame({'Data': load_time_array})
    # writer = pd.ExcelWriter(filename, engine='xlsxwriter')
    # df.to_excel(writer, sheet_name="sheet1")
    # writer.save()
