import serial

arduino = 0

def Initialize(port):
    global arduino
    arduino = serial.Serial(port, 115200)
    arduino.close()
    arduino.open()    
    while True:
        some_line = arduino.readline()
        #print '$', some_line, '$'
        if'ready' in some_line:
            break

def SendInstructions(instructions):
    global arduino
    send_count = 0

    if arduino == 0:
        return

    for i in instructions:
        print 'sent ' + i
        send_count += 1
        arduino.write(i)
        if send_count == 100:
            arduino.write('go!')
            send_count = 0
            some_line = arduino.readline()
            #print some_line
            assert 'ready' in some_line
    if send_count > 0:
        arduino.write('go!')
        some_line = arduino.readline()
        #print some_line
        assert 'ready' in some_line
            