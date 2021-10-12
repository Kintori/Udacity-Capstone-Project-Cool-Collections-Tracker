import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk';
import {CollectedItem} from "../models/CollectedItem";
import {Collection} from "../models/Collection";
import {createLogger} from "./logger";

const XAWS = AWSXRay.captureAWS(AWS);

const docClient = new XAWS.DynamoDB.DocumentClient();
const collectionsTable = process.env.COLLECTIONS_TABLE;
const collectedItemsTable = process.env.COLLECTED_ITEMS_TABLE;
const collectedItemsCollectionIdIndex = process.env.COLLECTED_ITEMS_COLLECTION_ID_INDEX;

const logger = createLogger('dataLayer');

export async function createCollectedItem(newItem: CollectedItem) {
  logger.info("In dataLayer creating new collected item");
  await docClient.put({
    TableName: collectedItemsTable,
    Item: newItem
  }).promise();

  return newItem
}

export async function createCollection(newItem: Collection) {
  logger.info("In dataLayer creating new collection");
  await docClient.put({
    TableName: collectionsTable,
    Item: newItem
  }).promise();

  return newItem
}

export async function deleteCollectedItem(key: any) {
  logger.info("In dataLayer deleting collected item");
  await docClient.delete({
      TableName: collectedItemsTable,
      Key: key
    }).promise();
}

export async function deleteCollection(key: any) {
  logger.info("In dataLayer deleting collection");
  await docClient.delete({
      TableName: collectionsTable,
      Key: key
    }).promise();
}

export async function getCollectedItem(userId: string, itemId: string) {
  logger.info("In dataLayer getting a collected item");
  const result = await docClient.query({
    TableName: collectedItemsTable,
    KeyConditionExpression: 'userId = :userId and itemId = :itemId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':itemId': itemId
    },
    Limit: 1,
    ScanIndexForward: false
  }).promise();

  return result.Items
}

export async function getCollectedItemsForCollection(collectionId: string) {
  logger.info("In dataLayer getting all collected items in a collection");
  const result = await docClient.query({
    TableName: collectedItemsTable,
    IndexName : collectedItemsCollectionIdIndex,
    KeyConditionExpression: 'collectionId = :collectionId',
    ExpressionAttributeValues: {
      ':collectionId': collectionId
    },
    ScanIndexForward: false
  }).promise();

  return result.Items
}

export async function getCollection(userId: string, collectionId: string) {
  logger.info("In dataLayer getting a collection");
  const result = await docClient.query({
    TableName: collectionsTable,
    KeyConditionExpression: 'userId = :userId and collectionId = :collectionId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':collectionId': collectionId
    },
    Limit: 1,
    ScanIndexForward: false
  }).promise();

  return result.Items
}

export async function getCollectionsForUser(userId: string) {
  logger.info("In dataLayer getting all collections for a user");
  const result = await docClient.query({
    TableName: collectionsTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise();

  return result.Items
}

export async function updateCollectedItem(key: any, title: string, description: string) {
  logger.info("In dataLayer updating a collected item");
  await docClient.update({
    TableName: collectedItemsTable,
    Key: key,
    UpdateExpression: "set title=:title, description=:description",
    ExpressionAttributeValues:{
        ":title":title,
        ":description":description,
    },
    ReturnValues:"UPDATED_NEW"
  }).promise();
}

export async function updateCollection(key: any, title: string, description: string) {
  logger.info("In dataLayer updating a collection");
  await docClient.update({
    TableName: collectionsTable,
    Key: key,
    UpdateExpression: "set title=:title, description=:description",
    ExpressionAttributeValues:{
        ":title":title,
        ":description":description,
    },
    ReturnValues:"UPDATED_NEW"
  }).promise();
}





