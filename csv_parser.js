const fileInput = document.getElementById('fileInput');

// Listens for a new CSV file to be selected on the page
fileInput.addEventListener('change', function() {
    // read the newly inputed file
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        // parse the csv string once file is read by FileReader
        let canMessages = CAN_Message.parse(e.target.result.trimEnd()); // trim to rid of blank line
        CAN_Message.display(canMessages);
    };
    reader.readAsText(file);
});


class CAN_Message {

    static parse(csv) {
        // Parses CSV data into an array of CAN_Messages
        let msgs = []; // reset collection of CAN messages
        let lines = csv.split('\n');
        for(const line of lines){
            let msg = new CAN_Message(line);
            msgs.push(msg);
        }
        return msgs;
    }

    static display(msgs) {
        // Displays all CAN messages into single c3.js graph
        let timestamps = {};
        let payloadData = {};
        let idDatumCorrespondence = {};
        for(const msg of msgs) {
            if(timestamps[msg.id] === undefined) {
                timestamps[msg.id] = [String(msg.id)];
            }
            timestamps[msg.id].push(msg.timestamp);
            
            for(const datumName in msg.payload) {
                if(payloadData[datumName] === undefined) {
                    payloadData[datumName] = [datumName];
                    idDatumCorrespondence[datumName] = String(msg.id);
                }
                payloadData[datumName].push(msg.payload[datumName]);
            }
        }
        // console.log(timestamps);
        // console.log(payloadData);
        // console.log(idDatumCorrespondence);

        // Uses c3.js library for graphing data of the format given
        // by idDatumCorrespondence, timestamps, and payloadData
        c3.generate({
            xFormat: '%L',
            data: {
                xs: idDatumCorrespondence,
                columns: Object.values(timestamps).concat(Object.values(payloadData))
            },
            axis: {
                x: {
                    label: "Time since start (ms)",
                    type: 'timeseries',
                    tick: {
                        format: '%M:%S:%L'
                    }
                },
                y: {
                    label: "Payload value"
                }
            },
            zoom: {
                enabled: true,
                extent: [1,5]
            },
            subchart: {
                show: true
            }
        });
    }

    constructor(csvLine) {
        let fields = csvLine.split(',');
        for(let i = 0; i < fields.length; ++i) {
            if(fields[i] !== '') {
                fields[i] = Number(fields[i]);
            }
        } // Make data into nice array of numbers

        // The basic properties of a CAN_Message from a line of the CSV file
        this.id = fields.shift();
        this.timestamp = fields.pop();
        // fields array only contains the payload at this point
        this.payload = {}

        // Payload data format is dependent on id of the CAN message
        // Assign payload meaning using https://docs.google.com/spreadsheets/d/1NBGkYXU-0hWoHLGAnpFGG1UOc4kb2333ix3pwNxI9C4
        switch(this.id) {
            // PCAN
            case 0x0C0: // VCU -- Torque Request Command Message
                this.payload = {
                    'Torque Command': (fields[0] << 8) + fields[1],
                    'Direction Command': fields[4],
                    'Inverter Settings': fields[5],
                    'Commanded Torque Limit': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x388: // BMS Main? -- BMS Voltages
                this.payload = {
                    'Minimum Voltage': (fields[0] << 8) + fields[1],
                    'Maximum Voltage': (fields[2] << 8) + fields[3],
                    'Pack Voltage': (fields[4] << 24) + (fields[5] << 16) + (fields[6] << 8) + fields[7],
                }
                break;
            // MC
            case 0x0A0: // MC Temperatures 1
                this.payload = {
                    'Module A Temp': (fields[0] << 8) + fields[1],
                    'Module B Temp': (fields[2] << 8) + fields[3],
                    'Module C Temp': (fields[4] << 8) + fields[5],
                    'Gate Driver Board Temp': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0A1: // MC Temperatures 2
                this.payload = {
                    'Control Board Temp': (fields[0] << 8) + fields[1],
                    'RTD #1 Temp': (fields[2] << 8) + fields[3],
                    'RTD #2 Temp': (fields[4] << 8) + fields[5],
                    'RTD #3 Temp': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0A2: // MC Temperatures 3
                this.payload = {
                    'Coolant/RTD #4': (fields[0] << 8) + fields[1],
                    'Hot Spot/RTD #5': (fields[2] << 8) + fields[3],
                    'Motor Temp': (fields[4] << 8) + fields[5],
                    'Torque Shudder': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0A5: // Motor Position Info
                this.payload = {
                    'Motor Angle': (fields[0] << 8) + fields[1],
                    'Motor Speed': (fields[2] << 8) + fields[3],
                    'Electrical Output Frequency': (fields[4] << 8) + fields[5],
                    'Delta Resolver Filtered': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0A6: // Motor Controller Current Info
                this.payload = {
                    'Phase A Current': (fields[0] << 8) + fields[1],
                    'Phase B Current': (fields[2] << 8) + fields[3],
                    'Phase C Current': (fields[4] << 8) + fields[5],
                    'DC Bus Current': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0A7: // Motor Controller Voltage Info
                this.payload = {
                    'DC Bus Voltage': (fields[0] << 8) + fields[1],
                    'Output Voltage': (fields[2] << 8) + fields[3],
                    'VAB_Vd_Voltage': (fields[4] << 8) + fields[5],
                    'VBC_Vq_Voltage': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0A8: // Motor Controller Flux Info
                this.payload = {
                    'Flux Command': (fields[0] << 8) + fields[1],
                    'Flux Feedback': (fields[2] << 8) + fields[3],
                    'Id Feedback': (fields[4] << 8) + fields[5],
                    'Iq Feedback': (fields[6] << 8) + fields[7]
                }
                break;
            // TODO: understand why document has two with the same CAN ID
            case 0x0AB: // Motor Controller Fault Codes
                this.payload = {
                    'POST Fault Low': (fields[0] << 8) + fields[1],
                    'POST Fault High': (fields[2] << 8) + fields[3],
                    'Run Fault Low': (fields[4] << 8) + fields[5],
                    'Run Fault High': (fields[6] << 8) + fields[7]
                }
                break;
            case 0x0AB: // Motor Controller Torque and Timer Info
                this.payload = {
                    'Commanded Torque': (fields[0] << 8) + fields[1],
                    'Torque Feedback': (fields[2] << 8) + fields[3],
                    'Power on Timer': (fields[4] << 24) + (fields[5] << 16) + (fields[6] << 8) + fields[7]
                }
                break;
            // TCAN
            case 0x470: // Front Left Wheel Speed Sensor
                this.payload = {
                    'Front Left Wheel Pulse Time': (fields[0] << 8) + fields[1],
                }
                break;
            case 0x471: // Front Right Wheel Speed Sensor
                this.payload = {
                    'Front Right Wheel Pulse Time': (fields[0] << 8) + fields[1],
                }
                break;
            case 0x472: // Rear Left Wheel Speed Sensor
                this.payload = {
                    'Rear Left Wheel Pulse Time': (fields[0] << 8) + fields[1],
                }
                break;
            case 0x473: // Rear Right Wheel Speed Sensor
                this.payload = {
                    'Rear Right Wheel Pulse Time': (fields[0] << 8) + fields[1],
                }
                break;
            case 0x475: // Steering Angle Sensor
                this.payload = {
                    'Steering Voltage': (fields[0] << 8) + fields[1],
                }
                break;
            default:
                throw `CAN Message has an unregistered ID: ${this.id}`;
        } // end of switch
    
    } // end of constructor()
}