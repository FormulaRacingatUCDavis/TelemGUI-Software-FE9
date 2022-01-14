# TelemGUI-Software-FE9

GUI Program for displaying FE9 telemetry data.

This program follows the conventions laid out in the [Can Index](https://docs.google.com/spreadsheets/d/1NBGkYXU-0hWoHLGAnpFGG1UOc4kb2333ix3pwNxI9C4/edit#gid=1391358092).

## Files
 - testing/csv_generator.py is a python script which randomly generates csv files using the Message class for purposes of testing.
 - testing/message.py implements the Message class.
 - testing/convert_data.py converts raw CAN messages into a human readable csv file. (temporarily outputs js file for web gui testing, comment last code block for csv)
 - node_modules/ and associated html and js files are for experimenting with a web frontend. They may be removed in the future if we decide to go with a different frontend.

 ## TODO
 -[x] Write random csv data generator
 -[x] Write csv data parser
 -[ ] Write frontend
    - Python QT framework with PyQtGraph/MatPlotLib
    - Python Flask/Django framework with C3.js/Plotly/Chart.js
    - C# .NET framework with Chart tools (only on .NET 3)
- [ ] Integrate backend parser with frontend
- [ ] Add live viewing option from transciever
- [ ] Integrate live viewing and retroactive viewing into one program
## Testing

### Generating csv files

The csv generator script is in the Testing directory.

Pass the file name and line count using the -f and -l arguments. These are optional, without passing them the program will generate 100 lines and output to a file called data.csv. **This will write over any existing file named data.csv** in the current directory.

```
python csv_generator.py -f <filename> -l <linecount>
```


Use the -h argument for more information on what these do.

```
python csv_generatory.py -h
```
