from serial.serialutil import SerialException, SerialTimeoutException
from serial.tools import list_ports
from serial import Serial
from time import sleep, time
import sys

# print(list_ports.comports())
# ports added after program start take some time to fully connect
connected_ports = set(list_ports.comports())
port_wait_table = {} # table of when to wait until for each connecting port
success_response = bytes([69, 69, 69])
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
                ser.write(bytes([0xFF, 0xFF, 0x80, 0x00, 0x80]))
            except SerialTimeoutException:
                print(f"Unable to write to {port.name}")
                continue
            b = ser.read(3)
            print(b)
            if b == success_response:
                print("Handshake Success.")
                while port in list_ports.comports():
                    sleep(0.1) # actual program would continuously read data here from the connected device
                print(f"{port.name} disconnected.")
                break
                # print("Program Terminating...")
                # sys.exit()