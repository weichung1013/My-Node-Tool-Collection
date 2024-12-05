const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');

const inputFilePath = 'lastest_vehicle_data_from_20241129_to_20241202.csv';
const outputFilePath = 'lastest_vehicle_data_from_20241129_to_20241202_edited.csv';

const vinCodes = new Set();
const results = [];

fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => {
        if (!vinCodes.has(data.vin_code)) {
            vinCodes.add(data.vin_code);
            // to gmt+8 timezone
            const date = new Date();
            if (!isNaN(date.getTime())) {
                date.setHours(date.getHours() + 8);
                // format 2024-11-28 14:53:11.000
                data.created_at = date.toISOString().slice(0, 19).replace('T', ' ');
                data.updated_at = date.toISOString().slice(0, 19).replace('T', ' ');
            }
            results.push(data);
        }
    })
    .on('end', () => {
        const csvOutput = parse(results);
        fs.writeFileSync(outputFilePath, csvOutput);
        console.log('CSV file processed successfully.');
    });