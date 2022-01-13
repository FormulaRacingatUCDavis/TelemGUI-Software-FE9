import argparse
import json
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
    timestamp = int(fields[-1])
    return (name, full16, timestamp)
    
    

if __name__ == '__main__':

    # parse cli arguments to get file name
    parser = argparse.ArgumentParser(
        description="Convert CAN telemetry data in human readable data.")
    parser.add_argument(
        '-f', '--file', default="../testing/data.csv", help="Name of the data file to be processed.")
    parser.add_argument(
        '-o', '--output', default="out.js", help="Name of the output file."
    )

    args = parser.parse_args()

    file_name = str(args.file)
    out_file = str(args.output)

    with open(file_name) as file:
        csv_lines = file.readlines()
    
    parsed_data = {} # each key represents a CAN message id as a string
                     # which maps to a list of parsed TCAN payload (16-bit int) with timestamps
    for line in csv_lines:
        data = parse_csv_line(line.strip())
        # we assume that the csv data is in sorted by timestamp
        id = data[0]
        if id not in parsed_data:
            parsed_data[id] = []
        payload, timestamp = data[1], data[2]
        parsed_data[id].append((payload, timestamp))

    # change to c3 json format
    c3_dictionary = {
        'xs': {},
        'columns': []
    }
    for id, array in parsed_data.items():
        c3_dictionary['xs'][id] = 'x ' + id
        payloads = [id]
        times = ['x ' + id]
        for pair in array:
            payloads.append(pair[0])
            times.append(pair[1])
        c3_dictionary['columns'].append(payloads)
        c3_dictionary['columns'].append(times)

    
    # write json
    with open(out_file, 'w') as of:
        of.write("json_data = ")
        of.write(json.dumps(c3_dictionary))
    
    