import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createCollection } from '../api/collections-api'

enum CreationState {
  NoCreation,
  MakingCreationCall,
  CreationCallCompleted,
}

interface CreateCollectionProps {
  auth: Auth
}

interface CreateCollectionState {
  title: string
  description: string
  createCollectionState: CreationState
}

export class CreateCollection extends React.PureComponent<
  CreateCollectionProps,
  CreateCollectionState
> {
  state: CreateCollectionState = {
    title: '',
    description: '',
    createCollectionState: CreationState.NoCreation
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

      this.setCreateCollectionState(CreationState.MakingCreationCall)
      await createCollection(this.props.auth.getIdToken(),  {
        title: this.state.title,
        description: this.state.description,
      })

      this.setCreateCollectionState(CreationState.CreationCallCompleted)

      alert('Collection was created!')
    } catch (e) {
      alert('Could not create collection: ' + e)
    } finally {
      this.setCreateCollectionState(CreationState.NoCreation)
    }
  }

  setCreateCollectionState(createCollectionState: CreationState) {
    this.setState({
      createCollectionState
    })
  }

  render() {
    return (
      <div>
        <h1>Create New Collection</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Title</label>
            <input
              placeholder="Your Collection's Title"
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="A Description of Your Collection"
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
        {this.state.createCollectionState === CreationState.MakingCreationCall && <p>Making Create Collection Call</p>}
        {this.state.createCollectionState === CreationState.CreationCallCompleted && <p>Create Collection Call Completed</p>}
        <Button
          loading={this.state.createCollectionState !== CreationState.NoCreation}
          type="submit"
        >
          Create
        </Button>
      </div>
    )
  }
}
