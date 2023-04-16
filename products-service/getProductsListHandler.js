'use strict';

const productTableName = 'aws_db_zubarau';
const stocksTableName = 'stocks';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsList = async (event, context) => {
    try {
        const products = await dynamodb.scan({ TableName: productTableName }).promise();
        const stocks = await dynamodb.scan({ TableName: stocksTableName }).promise();

        const items = products.Items.map((product) => {
            const stock = stocks.Items.find((stock) => stock.product_id === product.id);
            return { ...product, count: stock ? stock.count : 0 };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.message,
        };
    }
};


