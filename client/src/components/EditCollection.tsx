import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getCollectedItem, getCollection, updateCollection } from '../api/collections-api'

enum UpdateState {
  NoUpdate,
  MakingUpdateCall,
  UpdateCallCompleted,
}

interface EditCollectionProps {
  match: {
    params: {
      collectionId: string
    }
  }
  auth: Auth
}

interface EditCollectionState {
  title: string
  description: string
  updateCollectionState: UpdateState
}

export class EditCollection extends React.PureComponent<
  EditCollectionProps,
  EditCollectionState
> {
  state: EditCollectionState = {
    title: '',
    description: '',
    updateCollectionState: UpdateState.NoUpdate
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    if (!title) return

    this.setState({
      title: title
    })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value
    if (!description) return

    this.setState({
      description: description
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.title) {
        alert('Collection needs a title!')
        return
      }
      if (!this.state.description) {
        alert('Collection needs a description!')
        return
      }

      this.setUpdateCollectionState(UpdateState.MakingUpdateCall)
      await updateCollection(this.props.auth.getIdToken(), this.props.match.params.collectionId,  {
        title: this.state.title,
        description: this.state.description,
      })

      this.setUpdateCollectionState(UpdateState.UpdateCallCompleted)

      alert('Collection was updated!')
    } catch (e) {
      alert('Could not update collection: ' + e)
    } finally {
      this.setUpdateCollectionState(UpdateState.NoUpdate)
    }
  }

  setUpdateCollectionState(updateCollectionState: UpdateState) {
    this.setState({
      updateCollectionState
    })
  }

  async componentDidMount() {
    try {
      const collection = await getCollection(this.props.auth.getIdToken(), this.props.match.params.collectionId)
      this.setState({
        title: collection.title,
        description: collection.description
      })
    } catch (e) {
      alert(`Failed to fetch collection by id: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <h1>Edit Collection</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Title</label>
            <input
              placeholder="Your Collection's Title"
              defaultValue={this.state.title}
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="A Description of Your Collection"
              defaultValue={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.updateCollectionState === UpdateState.MakingUpdateCall && <p>Making Update Collection Call</p>}
        {this.state.updateCollectionState === UpdateState.UpdateCallCompleted && <p>Update Collection Call Completed</p>}
        <Button
          loading={this.state.updateCollectionState !== UpdateState.NoUpdate}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
