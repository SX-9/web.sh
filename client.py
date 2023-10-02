#! /bin/python3

from requests import post
from os import system 

def clear():
    system('clear')

hostip = input('Address:  ')
passwd = input('Password: ')

def exec(cmd):
    global hostip, passwd
    return post('http://'+hostip+':6942/run?pass='+passwd,json=cmd)

info = exec(['notify-send', 'Web.SH: New Client Connected!'])
if info.status_code == 401:
    print('Access Denied')
    exit(1)
else:
    clear()
    while True:
        cmd = input('['+info.json().get('host')+'] $ ')
        if cmd == 'clear':
            clear()
            continue
        elif cmd == 'exit':
            exit()
        cmd = exec(cmd.split(' '))
        print(cmd.json().get('output'))
