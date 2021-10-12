import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {
  deleteCollectedItem,
  getCollectedItems,
  getCollection,
} from '../api/collections-api'
import Auth from '../auth/Auth'
import { CollectedItem } from '../types/CollectedItem'
import { Collection } from '../types/Collection'

interface CollectedItemsProps {
  match: {
    params: {
      collectionId: string
    }
  }
  auth: Auth
  history: History
}

interface CollectedItemsState {
  collection?: Collection
  collectedItems: CollectedItem[]
  loadingCollectedItems: boolean
}

export class CollectedItems extends React.PureComponent<CollectedItemsProps, CollectedItemsState> {
  state: CollectedItemsState = {
    collection: undefined,
    collectedItems: [],
    loadingCollectedItems: true
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/collectedItem/${itemId}/edit`)
  }

  onCollectedItemCreate = async () => {
    this.props.history.push(`/collections/${this.props.match.params.collectionId}/create-item`)
  }

  onCollectedItemDelete = async (itemId: string) => {
    try {
      await deleteCollectedItem(this.props.auth.getIdToken(), itemId)
      this.setState({
        collectedItems: this.state.collectedItems.filter(item => item.itemId !== itemId)
      })
    } catch {
      alert('Collected item deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const collection = await getCollection(this.props.auth.getIdToken(), this.props.match.params.collectionId)
      const collectedItems = await getCollectedItems(this.props.auth.getIdToken(), this.props.match.params.collectionId)
      this.setState({
        collection,
        collectedItems,
        loadingCollectedItems: false
      })
    } catch (e) {
      alert(`Failed to fetch collection: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Collection: {this.state.collection?.title}</Header>
        <p>{this.state.collection?.description}</p>

        {this.renderCreateCollectionInput()}

        {this.renderCollectedItems()}
      </div>
    )
  }

  renderCreateCollectionInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} textAlign="center">
          <Button
            color='teal'
            labelPosition='left'
            icon='add'
            content='Add Item'
            onClick={() => this.onCollectedItemCreate()}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCollectedItems() {
    if (this.state.loadingCollectedItems) {
      return this.renderLoading()
    }

    return this.renderCollectedItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Collection's Items
        </Loader>
      </Grid.Row>
    )
  }

  renderCollectedItemsList() {
    return (
      <Grid padded>
        {this.state.collectedItems.map((item, pos) => {
          return (
            <Grid.Row key={item.itemId}>
              <Grid.Column width={11} verticalAlign="middle">
                {item.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {item.createdAt}
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                {item.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(item.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCollectedItemDelete(item.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {item.picture && (
                <Image src={item.picture} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
