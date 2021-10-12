import { apiEndpoint } from '../config'
import { Collection } from '../types/Collection';
import { CreateCollectionRequest } from '../types/CreateCollectionRequest';
import Axios from 'axios'
import { UpdateCollectedItemRequest } from '../types/UpdateCollectedItemRequest';
import { UpdateCollectionRequest } from '../types/UpdateCollectionRequest';
import { CollectedItem } from '../types/CollectedItem'
import { CreateCollectedItemRequest } from '../types/CreateCollectedItemRequest'

export async function getCollections(idToken: string): Promise<Collection[]> {
  console.log('Fetching collections')

  const response = await Axios.get(`${apiEndpoint}/collections`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Collections:', response.data)
  return response.data.items
}

export async function getCollection(idToken: string, collectionId: string,): Promise<Collection> {
  console.log('Fetching collection')

  const response = await Axios.get(`${apiEndpoint}/collections/${collectionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Collection:', response.data)
  return response.data.item
}

export async function createCollection(
  idToken: string,
  newCollection: CreateCollectionRequest
): Promise<Collection> {
  const response = await Axios.post(`${apiEndpoint}/collections`,  JSON.stringify(newCollection), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function updateCollection(
  idToken: string,
  collectionId: string,
  updatedCollection: UpdateCollectionRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/collections/${collectionId}`, JSON.stringify(updatedCollection), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteCollection(
  idToken: string,
  collectionId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/collections/${collectionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function createCollectedItem(
  idToken: string,
  collectionId: string,
  newCollectedItem: CreateCollectedItemRequest
): Promise<CollectedItem> {
  const response = await Axios.post(`${apiEndpoint}/collecteditems/${collectionId}`,  JSON.stringify(newCollectedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function getCollectedItems(idToken: string, collectionId: string): Promise<CollectedItem[]> {
  console.log('Fetching collected items')

  const response = await Axios.get(`${apiEndpoint}/collecteditems/${collectionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Collected Items:', response.data)
  return response.data.items
}

export async function getCollectedItem(idToken: string, itemId: string): Promise<CollectedItem> {
  console.log('Fetching collected item')

  const response = await Axios.get(`${apiEndpoint}/collecteditem/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Collected Item:', response.data)
  return response.data.item
}

export async function updateCollectedItem(
  idToken: string,
  itemId: string,
  updatedCollectedItem: UpdateCollectedItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/collecteditems/${itemId}`, JSON.stringify(updatedCollectedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteCollectedItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/collecteditems/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/attachment/collecteditems/${itemId}`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
