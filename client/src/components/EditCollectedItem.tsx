import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  createCollection,
  getCollectedItem,
  getCollections,
  getUploadUrl,
  updateCollectedItem,
  uploadFile
} from '../api/collections-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditCollectedItemProps {
  match: {
    params: {
      itemId: string
    }
  }
  auth: Auth
}

interface EditCollectedItemState {
  title: string
  description: string
  picture: any
  uploadState: UploadState
}

export class EditCollectedItem extends React.PureComponent<
  EditCollectedItemProps,
  EditCollectedItemState
> {
  state: EditCollectedItemState = {
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

      await updateCollectedItem(this.props.auth.getIdToken(), this.props.match.params.itemId, {
        title: this.state.title,
        description: this.state.description,
      })
      alert('Title/Description Updated Successfully!')

      if (!this.state.picture) {
        alert('No picture was selected, thus no new picture was uploaded')
      } else {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.itemId)

        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, this.state.picture)

        alert('Picture was uploaded!')
      }

    } catch (e) {
      alert('Could not update collected item: ' + e)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const collectedItem = await getCollectedItem(this.props.auth.getIdToken(), this.props.match.params.itemId)
      this.setState({
        title: collectedItem.title,
        description: collectedItem.description
      })
    } catch (e) {
      alert(`Failed to fetch collected item by id: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <h1>Edit Collected Item</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Title</label>
            <input
              placeholder="Your Collected Item's Title"
              defaultValue={this.state.title}
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="A Description of Your Collected Item"
              defaultValue={this.state.description}
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
          Submit
        </Button>
      </div>
    )
  }
}
