'use strict';

const fs = require('fs');
const path = require('path');

module.exports.getProductsList = async (event) => {
    const filePath = path.join(__dirname, 'assets', 'products.json');
    const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return {
        statusCode: 200,
        body: JSON.stringify(products),
    };
};

