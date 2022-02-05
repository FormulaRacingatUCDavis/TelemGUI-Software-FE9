const csvLinesCountInput = document.getElementById('csvLinesNum');
const csvGenerateButton = document.getElementById('csvGenBtn');


csvGenerateButton.addEventListener('click', function() {
    let start = window.performance.now()
    CAN_Message.display(CAN_Message.parse(generateCsvText(csvLinesCountInput.value, 0x0A6)));
    // generateCsvText(csvLinesCountInput.value, 0x0A6); 
    console.log((window.performance.now() - start)/csvLinesCountInput.value);
    // takes about 1 microseconds per line while the python verson take ~4 microseconds per line
});

// currently completely values
function generateCsvText(linesCnt, canId) {
    let csvLines = [];
    // let timestamp = Math.round(window.performance.now()*1000);
    let timestamp = 0;

    for(let i = 0; i < linesCnt; ++i) {
        // each line holds multiple pieces of CAN data
        let lineData = Array(8).fill('');
        for(const format of Object.values(CAN_Format[canId].payloadFields)) {
            // let val = Math.random()*0xFF*format.byteLength;
            const maxVal = Math.pow(2, 8*format.byteLength)-1;
            let val = Math.floor(Math.pow(Math.sin(timestamp/180*Math.PI),2) * maxVal);
            for(let bytePosition = format.byteLength - 1; bytePosition >= 0; --bytePosition) {
                lineData[format.byteStart + bytePosition] = val & 0xFF;
                val = val >>> 8; // >>> is right shift without sign extension
            }
        }
        lineData.unshift('0x' + canId.toString(16).toUpperCase()); // CAN ID in hex
        lineData.push(timestamp); // timestamp
        csvLines.push(lineData.join(','));
        timestamp += 1;
        // timestamp += Math.random() * 10 +  1;
    }
    
    return csvLines.join('\n');
}