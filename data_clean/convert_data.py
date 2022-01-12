import argparse
from typing import Tuple

id_map = {
        0x470: "Front Left Wheel Speed",
        0x471: "Front Right Wheel Speed",
        0x472: "Rear Left Wheel Speed",
        0x473: "Rear Right Wheel Speed",
        0x475: "Steering Angle"
}

def parse_csv_line(line: str) -> Tuple[str, int, str]: 
    '''
    Given a line from the CSV as a string, parses line into a tuple.
    Only does TCAN message parsing where there are 2 payload bytes (upper and lower).  
    '''
    fields = line.split(",")
    message_id = int(fields[0], 16)
    name = id_map[message_id]
    upper8 = int(fields[1])
    lower8 = int(fields[2])
    # combine 2 bytes from TCAN CAN message payload of the CSV
    full16 = (upper8 << 8) + lower8
    timestamp = fields[-1]
    return (name, full16, timestamp)
    
    

if __name__ == '__main__':

    # parse cli arguments to get file name
    parser = argparse.ArgumentParser(
        description="Convert CAN telemetry data in human readable data.")
    parser.add_argument(
        '-f', '--file', default="../testing/data.csv", help="Name of the data file to be processed.")

    args = parser.parse_args()

    file_name = str(args.file)

    with open(file_name) as file:
        csv_lines = file.readlines()
    
    parsed_data = {} # each key represents a CAN message id as a string
                     # which maps to a list of parsed TCAN payload (16-bit int) with timestamps
    for i, line in enumerate(csv_lines):
        data = parse_csv_line(line.strip())
        # we assume that the csv data is in sorted by timestamp
        id = data[0]
        if id not in parsed_data:
            parsed_data[id] = []
        payload, timestamp = data[1], data[2]
        parsed_data[id].append((payload, timestamp))

    
    