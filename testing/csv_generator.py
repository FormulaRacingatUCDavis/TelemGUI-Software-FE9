import random
from numpy import dtype
import pandas as pd
import numpy as np
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
    generateCSV('data.csv', 100)