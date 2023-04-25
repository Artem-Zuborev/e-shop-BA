'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const productTableName = 'aws_db_zubarau';
const stocksTableName = 'stocks';

module.exports.getProductsById = async (event) => {
    const productId = event.pathParameters.id;

    try {
        const products = await dynamodb.scan({ TableName: productTableName }).promise();
        const stocks = await dynamodb.scan({ TableName: stocksTableName }).promise();

        const items = products.Items.map((product) => {
            const stock = stocks.Items.find((stock) => stock.product_id === product.id);
            return { ...product, count: stock ? stock.count : 0 };
        });

        const product = items.find((product) => product.id === productId);

        if (!product) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Product not found',
                }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(product),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.message,
        };
    }
};
