from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0

driver = webdriver.PhantomJS(executable_path=r'C:\Users\XIAOZHANG\AppData\Roaming\npm\node_modules\phantomjs-prebuilt\lib\phantom\bin\phantomjs.exe')


driver.get("http://54.84.148.162/")

username = driver.find_element_by_id("username")
password = driver.find_element_by_id("password")

username.send_keys("msenior")
password.send_keys("Scribbles1")

driver.find_element_by_id("submit").click()

soup=BeautifulSoup(driver.page_source,"html.parser")


for link in soup.findAll('a',{'class': 'waves-effect'}):
    href = "http://54.84.148.162/"+link.get('href')
    print(href)
