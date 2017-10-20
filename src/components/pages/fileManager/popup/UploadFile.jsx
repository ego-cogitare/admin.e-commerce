import React from 'react';
import { dispatch } from '../../../../core/helpers/EventEmitter';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';

export default class FileUploader extends React.Component {

  constructor(props) {
    super(props)
    this.state = { uploadingFiles: [], dropAreaHovered: false };
  }

  closePopup() {
    dispatch('popup:close');
  }

  handelDragEnter() {
    this.setState({ dropAreaHovered: true });
  }

  handelDragLeave() {
    this.setState({ dropAreaHovered: false });
  }

  handleDrop(dataTransfer) {
    var files = dataTransfer.files;
    for (let file of files) {
      this.refs.fileUploader.files = [file];
      this.refs.fileUploader.commonUpload();
    }
    this.setState({ dropAreaHovered: false });
  }

  doUpload(files, id) {
    setTimeout(() => {
      for (let file of files) {
        let fileInfo = {
          id,
          name: file.name,
          total: file.size,
          loaded: 0,
          status: 'loading',
          getProgress: function() {
            return 100 * this.loaded / this.total;
          },
          uploadProgress: function() {
            let progress = {
              total: Math.round(this.total / 1024 / 1024 / 1024) + 'GB',
              loaded: Math.round(this.loaded / 1024 / 1024 / 1024) + 'GB'
            };
            if (this.loaded < 1024) {
              progress.loaded = this.loaded + 'B';
            }
            else if (this.loaded < 1022976) {
              progress.loaded = Math.round(this.loaded / 1024) + 'KB';
            }
            else if (this.loaded < 1047527424) {
              progress.loaded = Math.round(this.loaded / 1024 / 1024) + 'MB';
            }
            if (this.total < 1024) {
              progress.total = this.total + 'B';
            }
            else if (this.total < 1022976) {
              progress.total = Math.round(this.total / 1024) + 'KB';
            }
            else if (this.total < 1047527424) {
              progress.total = Math.round(this.total / 1024 / 1024) + 'MB';
            }
            return progress.loaded + ' / ' + progress.total;
          }
        };
        if (file.size > 1024 * 1024 * 1024) {
          fileInfo.status = 'error';
          fileInfo.message = 'File size over the maximum upload file size (1 GB)';
        }
        this.setState({ uploadingFiles: this.state.uploadingFiles.concat([fileInfo]) })
      }
    });
  }

  /*
   * Update progress bar statuses
   */
  uploading(progress, id) {
    let files = this.state.uploadingFiles.map((file) => {
      if (file.id === id) {
        file.loaded = progress.loaded;
      }
      return file;
    });
    this.setState({ uploadingFiles: files });
  }

  uploadSuccess(uploadedFile) {
    let files = this.state.uploadingFiles.map((file) => {
      if (uploadedFile.name === file.name) {
        file.status = 'success';
        file.loaded = file.total;
      }
      return file;
    });
    this.setState({ uploadingFiles: files });

    // Update files list
    dispatch('file-manager:directory:load', { path: this.props.path });
  }

  uploadError(error) {
    let files = this.state.uploadingFiles;
    for (let i = files.length - 1; i >= 0; i--) {
      if (error.field === files[i].name) {
        files[i].status = 'error';
        files[i].loaded = 0;
        files[i].message = error.message;
        break;
      }
    }
    this.setState({ uploadingFiles: files });
  }

  clearCompleted() {
    this.setState({
      uploadingFiles: this.state.uploadingFiles.filter(
        (file) => file.status !== 'success'
      )
    });
  }

  get uploadderConfig() {
    return {
      baseUrl: config.backUrl + '/file',
      param:{
        path: this.props.path
      },
      withCredentials: true,
      fileFieldName: 'uploadFile',
      multiple: false,
      numberLimit: 10,
      doUpload: this.doUpload.bind(this),
      uploading: this.uploading.bind(this),
      uploadSuccess: this.uploadSuccess.bind(this),
      uploadFail: this.uploadError.bind(this),
      uploadError: this.uploadError.bind(this)
    };
  }

  render() {
    return (
      <div class="file-upload">
        <div class="modal-body">
          <div class={"drop-area" + (this.state.dropAreaHovered ? " hovered" : "")}>
            <FileDragAndDrop
              onDrop={this.handleDrop.bind(this)}
              onDragEnter={this.handelDragEnter.bind(this)}
              onDragLeave={this.handelDragLeave.bind(this)}
            >
              Drop files here...
            </FileDragAndDrop>
          </div>
          <FileUpload ref="fileUploader" options={this.uploadderConfig}></FileUpload>
          <div class="uploading-files">
          {this.state.uploadingFiles.map((file, key) => {
            return (
              <div class="uploading-file" key={key}>
                <div class="progress-group">
                  <span class="progress-text">{file.name}</span>
                  <span class="progress-number">{file.uploadProgress()}</span>
                  <div class="progress sm">
                    <div class="progress-bar progress-bar-aqua"
                      style={{ width: file.getProgress() + '%', transition: 'width .0s ease' }}
                    />
                  </div>
                  <div class="progress-message text-danger">{file.message}</div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onClick={this.clearCompleted.bind(this)}>Clear completed</button>
          <button type="button" class="btn btn-default" onClick={this.closePopup.bind(this)}>Cancel</button>
        </div>
      </div>
    );
  }
}
