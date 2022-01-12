# TelemGUI-Software-FE9

GUI Program for displaying FE9 telemetry data.

This program follows the conventions laid out in the [Can Index](https://docs.google.com/spreadsheets/d/1NBGkYXU-0hWoHLGAnpFGG1UOc4kb2333ix3pwNxI9C4/edit#gid=1391358092).

## Files
 - testing/csv_generator.py is a python script which randomly generates csv files using the Message class for purposes of testing.
 - testing/message.py implements the Message class.
 - data_clean/convert_data.py converts raw CAN messages into a human readable csv file.

## Testing

### Generating csv files

The csv generator script is in the Testing directory.

You must pass the file name and line count using the -f and -l arguments.

```
python csv_generator.py -f <filename> -l <linecount>
```

Use the -h argument for more information on what these do.

```
python csv_generatory.py -h
```