const fileInput = document.getElementById('fileInput');

// Listens for a new CSV file to be selected on the page
fileInput.addEventListener('input', function () {
    // read the newly inputed file
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        // parse the csv string once file is read by FileReader
        let canMessages = CAN_Message.parse(e.target.result.trimEnd()); // trim to rid of blank line
        CAN_Message.display(canMessages);
    };
    reader.readAsText(file);
});


class CAN_Message {

    static parse(csv) {
        // Parses CSV string data into an array of CAN_Messages
        let msgs = []; // reset collection of CAN messages
        let lines = csv.split('\n');
        for (const line of lines) {
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
        for (const msg of msgs) {
            if (timestamps[msg.id] === undefined) {
                timestamps[msg.id] = [String(msg.id)];
            }
            timestamps[msg.id].push(msg.timestamp);

            for (const datumName in msg.payload) {
                if (payloadData[datumName] === undefined) {
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
                        format: '%M:%S.%L' // https://github.com/d3/d3-time-format/blob/v4.1.0/README.md#timeFormat
                    }
                },
                y: {
                    label: "Payload value"
                }
            },
            zoom: {
                enabled: true,
                extent: [1, 5]
            },
            subchart: {
                show: true
            }
        });
    }

    constructor(csvLine) {
        let fields = csvLine.split(',');
        for (let i = 0; i < fields.length; ++i) {
            if (fields[i] !== '') {
                fields[i] = Number(fields[i]);
            }
        } // Make data into nice array of numbers

        // The basic properties of a CAN_Message from a line of the CSV file
        this.id = fields.shift();
        this.timestamp = fields.pop();
        // fields array only contains the payload at this point
        this.payload = {}

        if (!Object.keys(CAN_Format).includes(String(this.id))) // assertion
            throw `CAN Message has an unregistered ID: ${this.id}`;

        // Payload data format is dependent on id of the CAN message
        const fieldFormats = CAN_Format[this.id].payloadFields;
        for (const [fieldName, format] of Object.entries(fieldFormats)) {
            this.payload[fieldName] = 0;
            for (let i = 0; i < format.byteLength; ++i) {
                this.payload[fieldName] = (this.payload[fieldName] << 8) + fields[format.byteStart + i];
            }
        }
    } // end of constructor()
}

