import re 
f = open('applepay.pem', 'r').read()
def strip(string):
    return re.sub(r'((-----)(\w|\s)+(-----))', '', f.replace('\n',''))
print(strip(f))
