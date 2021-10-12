import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  createCollectedItem,
  getUploadUrl,
  uploadFile
} from '../api/collections-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface CreateCollectedItemProps {
  match: {
    params: {
      collectionId: string
    }
  }
  auth: Auth
}

interface CreateCollectedItemState {
  title: string
  description: string
  picture: any
  uploadState: UploadState
}

export class CreateCollectedItem extends React.PureComponent<
  CreateCollectedItemProps,
  CreateCollectedItemState
> {
  state: CreateCollectedItemState = {
    title: '',
    description: '',
    picture: undefined,
    uploadState: UploadState.NoUpload
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

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picture = event.target.files
    if (!picture) return

    this.setState({
      picture: picture[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.title) {
        alert('Collected Item needs a title!')
        return
      }
      if (!this.state.description) {
        alert('Collected Item needs a description!')
        return
      }

      const newCollectedItem = await createCollectedItem(this.props.auth.getIdToken(), this.props.match.params.collectionId, {
        title: this.state.title,
        description: this.state.description,
      })
      alert('New Collected Item Created Successfully!')

      if (!this.state.picture) {
        alert('No picture was selected, thus no picture was uploaded for this item')
      } else {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), newCollectedItem.itemId)

        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, this.state.picture)

        alert('Picture was uploaded!')
      }

    } catch (e) {
      alert('Could not create collected item: ' + e)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Add New Collected Item</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Title</label>
            <input
              placeholder="Your Collected Item's Title"
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="A Description of Your Collected Item"
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Picture</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
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
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Create
        </Button>
      </div>
    )
  }
}
