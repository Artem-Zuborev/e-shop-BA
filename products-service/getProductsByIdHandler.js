'use strict';
const fs = require('fs');
const path = require('path');

module.exports.getProductsById = async (event) => {
    const productId = event.pathParameters.id;
    const filePath = path.join(__dirname, 'assets', 'products.json');
    const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const product = products.find((p) => p.id === productId);

    if (!product) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: `Product with id ${productId} not found`,
            }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(product),
    };
};




