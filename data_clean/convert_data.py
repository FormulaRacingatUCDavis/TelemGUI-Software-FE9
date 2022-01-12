import argparse

if __name__ == '__main__':

    # parse cli arguments to get file name
    parser = argparse.ArgumentParser(
        description="Convert CAN telemetry data in human readable data.")
    parser.add_argument(
        '-f', '--file', default="../testing/data.csv", help="Name of the data file to be processed.")

    args = parser.parse_args()

    file_name = str(args.file)

    with open(file_name) as file:
        csv_list = [line.split(',') for line in file.readlines()]
    