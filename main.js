

// var chart = c3.generate({
//     bindto: '#chart',
//     data: {
//         url: '/data_clean/out.json',
//         mimeType: 'json'
//     }
// });

var chart = c3.generate({
    data: json_data,
    axis: {
        x: {
            label: "Microseconds since start"
        },
        y: {
            label: "Payload value"
        }
    },
    zoom: {
        enabled: true,
        extent: [1,5]
    }
});