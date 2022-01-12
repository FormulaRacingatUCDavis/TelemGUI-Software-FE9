import argparse
from message import Message


def generateCSV(name_file: str, listsize: int) -> None:
    '''
    name_file: name of target csv file. Existing files with the same name will be overwritten
    listsize: number of lines of data to generate
    '''
    # Write list to file
    with open(name_file, 'w') as fn:
        for i in range(listsize):
            fn.write(str(Message.rand()))
            fn.write('\n')


# Program flow starts here
if __name__ == '__main__':
    # create command line argument parser
    parser = argparse.ArgumentParser(
        description="Generate sample telemetry data.")
    parser.add_argument('-f', '--file', default='data.csv',
                        help="Name of the output file")
    parser.add_argument('-l', '--line', default=100,
                        help="Number of lines to generate")

    args = parser.parse_args()

    filename = str(args.file)
    linecount = int(args.line)

    generateCSV(filename, linecount)
