import mysql.connector # database
import time
import tkinter # soket
import bluetooth 

# bluetooth
socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
socket.connect(("98:DA:60:07:F4:4C", 1))
print("bluetooth connected!")

# 데이터베이스 연결
conn = mysql.connector.connect(
    user = "team1",
    password = 'test',
    host = '211.254.214.74',
    database = 'iemh_team1'
)

# 커서 생성
cursor = conn.cursor()

while True:
    # 줄 선택
    cursor.execute("SELECT light FROM iemh_team1.sett LIMIT 1")
    result = cursor.fetchone()
    
    # value 업데이트 (예시)
    if result[0] != light:
        light = result[0]

    light_value = int(light)    # 정수화
    light_v = light_value//10   # 자릿수 변경
    light_s = str(light_v)      # 문자열 변경
    
    # 수내 산성값 
    ph_value = 10
    
    # bluetooth 송신 
    socket.send(light_s)
    print("1. 전송 밝기: " + light_s + "0% \n")

    # bluetooth 수신
    value1 = socket.recv(1024).decode('utf-8')  # 온도
    value2 = socket.recv(1024).decode('utf-8')  # 습도
    
    # 블루투스 정보 체크 및 온습도 쿼리 실행 
    if (value1 > value2) :
        print("2. 온도: %s" % value2)
        print("3. 습도: %s" % value1)
        cursor.execute(f"UPDATE iemh_team1.sett SET temp = {value2};")
        cursor.execute(f"UPDATE iemh_team1.sett SET hum = {value1};")
        socket.send('a')

    else :
        print("2. 온도: %s" % value1)
        print("3. 습도: %s" % value2)
        cursor.execute(f"UPDATE iemh_team1.sett SET temp = {value1};")
        cursor.execute(f"UPDATE iemh_team1.sett SET hum = {value2};")
        socket.send('a')
        
    # 쿼리 실행
    cursor.execute(f"UPDATE iemh_team1.sett SET light = {light};")
    cursor.execute(f"UPDATE iemh_team1.sett SET ph = {ph_value};")

    conn.commit()