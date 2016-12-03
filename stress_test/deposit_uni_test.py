import requests
from bs4 import BeautifulSoup







url="http://ec2-54-85-60-93.compute-1.amazonaws.com/"


payload={'username': "msenior",'password':"Scribbles1"}
s = requests.Session()
s.post('http://ec2-54-85-60-93.compute-1.amazonaws.com/api/signin',data=payload)




deposit_payload={'account_number':"1000000055",'amount':"44"}


s.post('http://ec2-54-85-60-93.compute-1.amazonaws.com/api/deposit',data=deposit_payload)

r=s.get(url+'deposit')
soup=BeautifulSoup(r.content,"html.parser")


