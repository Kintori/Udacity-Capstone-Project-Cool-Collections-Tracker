import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Loader
} from 'semantic-ui-react'

import { deleteCollection, getCollections } from '../api/collections-api'
import Auth from '../auth/Auth'
import { Collection } from '../types/Collection'
import { Link } from 'react-router-dom'

interface CollectionsProps {
  auth: Auth
  history: History
}

interface CollectionsState {
  collections: Collection[]
  loadingCollections: boolean
}

export class Collections extends React.PureComponent<CollectionsProps, CollectionsState> {
  state: CollectionsState = {
    collections: [],
    loadingCollections: true
  }

  onEditButtonClick = (collectionId: string) => {
    this.props.history.push(`/collections/${collectionId}/edit`)
  }

  onCollectionCreate = async () => {
    this.props.history.push(`/collections/create`)
  }

  onCollectionDelete = async (collectionId: string) => {
    try {
      await deleteCollection(this.props.auth.getIdToken(), collectionId)
      this.setState({
        collections: this.state.collections.filter(collection => collection.collectionId !== collectionId)
      })
    } catch {
      alert('Collection deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const collections = await getCollections(this.props.auth.getIdToken())
      this.setState({
        collections,
        loadingCollections: false
      })
    } catch (e) {
      alert(`Failed to fetch collections: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Collections</Header>
        <p>Click on a collection's name to see that collection's items.</p>

        {this.renderCreateCollectionInput()}

        {this.renderCollections()}
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
            content='New Collection'
            onClick={() => this.onCollectionCreate()}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCollections() {
    if (this.state.loadingCollections) {
      return this.renderLoading()
    }

    return this.renderCollectionsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading User's Collections
        </Loader>
      </Grid.Row>
    )
  }

  renderCollectionsList() {
    return (
      <Grid padded>
        {this.state.collections.map((collection, pos) => {
          return (
            <Grid.Row key={collection.collectionId}>
              <Grid.Column width={11} verticalAlign="middle">
                <Header as="h3"><Link to={`/collections/${collection.collectionId}`}>{collection.title}</Link></Header>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {collection.createdAt}
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                {collection.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(collection.collectionId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCollectionDelete(collection.collectionId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
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
