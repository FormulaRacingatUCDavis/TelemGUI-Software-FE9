// Assign payload meaning using https://docs.google.com/spreadsheets/d/1NBGkYXU-0hWoHLGAnpFGG1UOc4kb2333ix3pwNxI9C4
const CAN_Format = {
    0x0C0: // VCU -- 
    {
        'descriptor': 'Torque Request Command Message',
        'payloadFields': {
            'Torque Command': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Direction Command': {
                'byteStart': 4,
                    'byteLength': 1
            },
            'Inverter Settings': {
                'byteStart': 5,
                    'byteLength': 1
            },
            'Commanded Torque Limit': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x388: // BMS Main? --
    {
        'descriptor': 'BMS Voltages',
        'payloadFields': {
            'Minimum Voltage': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Maximum Voltage': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Pack Voltage': {
                'byteStart': 4,
                'byteLength': 4
            },
        }
    },
    // MC
    0x0A0:
    {
        'descriptor': 'MC Temperatures 1',
        'payloadFields': {
            'Module A Temp': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Module B Temp': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Module C Temp': {
                'byteStart': 4,
                'byteLength': 2
            },
            'Gate Driver Board Temp': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0A1:
    {
        'descriptor': 'MC Temperatures 2',
        'payloadFields': {
            'Control Board Temp': {
                'byteStart': 0,
                'byteLength': 2
            },
            'RTD #1 Temp': {
                'byteStart': 2,
                'byteLength': 2
            },
            'RTD #2 Temp': {
                'byteStart': 4,
                'byteLength': 2
            },
            'RTD #3 Temp': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0A2:
    {
        'descriptor': 'MC Temperatures 3',
        'payloadFields': {
            'Coolant/RTD #4': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Hot Spot/RTD #5': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Motor Temp': {
                'byteStart': 4,
                'byteLength': 2
            },
            'Torque Shudder': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0A5:
    {
        'descriptor': 'Motor Position Info',
        'payloadFields': {
            'Motor Angle': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Motor Speed': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Electrical Output Frequency': {
                'byteStart': 4,
                'byteLength': 2
            },
            'Delta Resolver Filtered': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0A6:
    {
        'descriptor': 'Motor Controller Current Info',
        'payloadFields': {
            'Phase A Current': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Phase B Current': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Phase C Current': {
                'byteStart': 4,
                'byteLength': 2
            },
            'DC Bus Current': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0A7:
    {
        'descriptor': 'Motor Controller Voltage Info',
        'payloadFields': {
            'DC Bus Voltage': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Output Voltage': {
                'byteStart': 2,
                'byteLength': 2
            },
            'VAB_Vd_Voltage': {
                'byteStart': 4,
                'byteLength': 2
            },
            'VBC_Vq_Voltage': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0A8:
    {
        'descriptor': 'Motor Controller Flux Info',
        'payloadFields': {
            'Flux Command': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Flux Feedback': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Id Feedback': {
                'byteStart': 4,
                'byteLength': 2
            },
            'Iq Feedback': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0AB:
    {
        'descriptor': 'Motor Controller Fault Codes',
        'payloadFields': {
            'POST Fault Low': {
                'byteStart': 0,
                'byteLength': 2
            },
            'POST Fault High': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Run Fault Low': {
                'byteStart': 4,
                'byteLength': 2
            },
            'Run Fault High': {
                'byteStart': 6,
                'byteLength': 2
            }
        }
    },
    0x0AB:
    {
        'descriptor': 'Motor Controller Torque and Timer Info',
        'payloadFields': {
            'Commanded Torque': {
                'byteStart': 0,
                'byteLength': 2
            },
            'Torque Feedback': {
                'byteStart': 2,
                'byteLength': 2
            },
            'Power on Timer': {
                'byteStart': 4,
                'byteLength': 4
            }
        }
    },
    0x470:
    {
        'descriptor': 'Front Left Wheel Speed Sensor',
        'payloadFields': {
            'Front Left Wheel Pulse Time': {
                'byteStart': 0,
                'byteLength': 2
            },
        }
    },
    0x471:
    {
        'descriptor': 'Front Right Wheel Speed Sensor',
        'payloadFields': {
            'Front Right Wheel Pulse Time': {
                'byteStart': 0,
                'byteLength': 2
            },
        }
    },
    0x472:
    {
        'descriptor': 'Rear Left Wheel Speed Sensor',
        'payloadFields': {
            'Rear Left Wheel Pulse Time': {
                'byteStart': 0,
                'byteLength': 2
            },
        }
    },
    0x473:
    {
        'descriptor': 'Rear Right Wheel Speed Sensor',
        'payloadFields': {
            'Rear Right Wheel Pulse Time': {
                'byteStart': 0,
                'byteLength': 2
            },
        }
    },
    0x475:
    {
        'descriptor': 'Steering Angle Sensor',
        'payloadFields': {
            'Steering Voltage': {
                'byteStart': 0,
                'byteLength': 2
            },
        }
    }
};