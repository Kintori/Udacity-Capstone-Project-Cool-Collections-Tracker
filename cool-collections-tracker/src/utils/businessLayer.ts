import * as DataLayer from './dataLayer'
import {CreateCollectedItemRequest} from "../requests/CreateCollectedItemRequest";
import {getCollectedItemAttachmentUrl} from "./attachmentUtils";
import * as uuid from 'uuid';
import {CreateCollectionRequest} from "../requests/CreateCollectionRequest";
import {UpdateCollectedItemRequest} from "../requests/UpdateCollectedItemRequest";
import {UpdateCollectionRequest} from "../requests/UpdateCollectionRequest";
import {createLogger} from "./logger";

const logger = createLogger('businessLayer');

export async function createCollectedItem(userId: string, collectionId: string, newCollectedItem: CreateCollectedItemRequest) {
  logger.info("In businessLayer creating new collected item");
  const itemId = uuid.v4();
  const createdAt = new Date().toISOString();
  const newItem = {
    collectionId,
    itemId,
    createdAt,
    userId,
    ...newCollectedItem,
    picture: getCollectedItemAttachmentUrl(itemId)
  };

  return await DataLayer.createCollectedItem(newItem)
}

export async function createCollection(userId: string, newCollection: CreateCollectionRequest) {
  logger.info("In businessLayer creating new collection");
  const collectionId = uuid.v4();
  const createdAt = new Date().toISOString();
  const newItem = {
    collectionId,
    createdAt,
    userId,
    ...newCollection,
  };

  return await DataLayer.createCollection(newItem)
}

export async function deleteCollectedItem(userId: string, itemId: string) {
  logger.info("In businessLayer deleting collected item");
  const key = {userId: userId, itemId: itemId};

  await DataLayer.deleteCollectedItem(key)
}

export async function deleteCollection(userId: string, collectionId: string) {
  logger.info("In businessLayer deleting collection");
  const key = {userId: userId, collectionId: collectionId};

  await DataLayer.deleteCollection(key)
}

export async function getCollectedItem(userId: string, itemId: string) {
  logger.info("In businessLayer getting a collected item");
  return await DataLayer.getCollectedItem(userId, itemId)
}

export async function getCollectedItemsForCollection(collectionId: string) {
  logger.info("In businessLayer getting all collected items in a collection");
  return await DataLayer.getCollectedItemsForCollection(collectionId)
}

export async function getCollection(userId: string, collectionId: string) {
  logger.info("In businessLayer getting a collection");
  return await DataLayer.getCollection(userId, collectionId)
}

export async function getCollectionsForUser(userId: string) {
  logger.info("In businessLayer getting all collections for a user");
  return await DataLayer.getCollectionsForUser(userId)
}

export async function updateCollectedItem(userId: string, itemId: string, updatedCollectedItem: UpdateCollectedItemRequest) {
  logger.info("In businessLayer updating a collected item");
  const key = {userId: userId, itemId: itemId};

  await DataLayer.updateCollectedItem(key, updatedCollectedItem.title, updatedCollectedItem.description)
}

export async function updateCollection(userId: string, collectionId: string, updatedCollection: UpdateCollectionRequest) {
  logger.info("In businessLayer updating a collection");
  const key = {userId: userId, collectionId: collectionId};

  await DataLayer.updateCollection(key, updatedCollection.title, updatedCollection.description)
}