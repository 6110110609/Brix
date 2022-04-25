import sys
import os
from Naked.toolshed.shell import execute_js

token = str(sys.argv[1])

# print('Argument list: ' + token)
os.system('raspistill -o /img/' + token + '.jpg')

result = execute_js('linebot.js ' + token)

if result:
    print("Success")
else:
    print("Fail")

os.remove("/img/" + token + ".jpg")