const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

const productTableName = 'aws_db_zubarau';
const stocksTableName = 'stocks';

module.exports.addProduct = async (event, context) => {
    const { title, description, price, count } = JSON.parse(event.body);
    const productId = uuid.v4();

    const productParams = {
        TableName: productTableName,
        Item: {
            id: productId,
            title,
            description,
            price,
        }
    };

    const stocksParams = {
        TableName: stocksTableName,
        Item: {
            product_id: productId,
            count: count,
        }
    };

    try {
        await Promise.all([
            dynamodb.put(productParams).promise(),
            dynamodb.put(stocksParams).promise(),
        ]);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ message: 'Product added successfully' })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': true
            },
            body: err.message
        };
    }
};

