from serial.serialutil import SerialException, SerialTimeoutException
from serial.tools import list_ports
from serial import Serial
from time import sleep, time
import sys

def start_port_listening(data_queue):
    # print(list_ports.comports())
    # ports added after program start take some time to fully connect
    connected_ports = set(list_ports.comports())
    port_wait_table = {} # table of when to wait until for each connecting port
    
    handshake_message = bytes([0xFF, 0xFF, 0, 0, 0, 0, 0])
    # In the firmware, the GUI and transciever are expected to send this message
    # back and forth to each other to establish a connection:
    # start flag = 0xFF, 0xFF (16 bits);
    # type = 0 (2 bits); dlc = 0 (6 bits);
    # xcvrID = 0 (4 bits); msgNum = 0 (12 bits);
    # no payload (0 bits); checksum = 0 (16 bits);
    # => 5 bytes of 0s after start flag.
    
    while True:
        detected_ports = set(list_ports.comports())
        connecting_ports = detected_ports - connected_ports
        connected_ports = connected_ports.intersection(detected_ports)
        port_wait_table = {port:time for port, time in port_wait_table.items() if port in connecting_ports} # rid of non-connecting ports
        for port in connecting_ports:
            if port in port_wait_table:
                if time() > port_wait_table[port]: # done waiting for port to connect
                    connected_ports.add(port)
            else:
                port_wait_table[port] = time() + 1 # we wait 1 seconds to connect (just a random choice)
        
        for port in connected_ports:
            # Avoid problem of usb insertion not working by delaying
            # looking at the new usb port connection when inserted.
            
            print(f"Attempt handshake with {port.name}")
            with Serial(port.name, timeout=0.15, write_timeout=0.15) as ser:
                try:
                    ser.write(handshake_message)
                except SerialTimeoutException:
                    print(f"Unable to write to {port.name}")
                    continue
                b = ser.read(7)
                print(b)
                if b == handshake_message:
                    print("Handshake Success.")
                    while port in list_ports.comports():
                        b = ser.read_all()
                        if len(b) > 0: # Not sure if this is necessary check
                            data_queue.put(b) # non-blocking with SimpleQueue
                    print(f"{port.name} disconnected.")
                    break # breaks from the for loop
                    # print("Program Terminating...")
                    # sys.exit()