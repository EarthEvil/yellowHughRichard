'''
the code need to perform the automation that go to the 'find nearest location'
link and enter a zip code and print out the response from the webpage
'''

from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0

driver = webdriver.PhantomJS(executable_path=r'C:\Users\XIAOZHANG\AppData\Roaming\npm\node_modules\phantomjs-prebuilt\lib\phantom\bin\phantomjs.exe')

url=("http://54.84.148.162/")
driver.get(url)

username = driver.find_element_by_id("username")
password = driver.find_element_by_id("password")

username.send_keys("msenior")
password.send_keys("Scribbles1")

driver.find_element_by_id("submit").click()



driver.get(url+'location') 

zipcode=driver.find_element_by_id("address")
zipcode.send_keys("19713")
driver.find_element_by_id("submit").click()

soup=BeautifulSoup(driver.page_source,"html.parser")







