import React from 'react';
import FileView from './partials/FileView.jsx';
import ParentDir from './partials/ParentDir.jsx';
import Breadcumps from './partials/Breadcumps.jsx';
import Filter from './partials/Filter.jsx';
import ViewChanger from './partials/ViewChanger.jsx';
import FileOperations from './partials/FileOperations.jsx';
import { directoryFiles } from '../../../actions/FileManager';
import { dispatch, subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import '../../../staticFiles/css/FileManager.css';
import DeleteFileDialog from './popup/DeleteFile.jsx';
import NewDirectoryDialog from './popup/NewDirectory.jsx';
import UploadFileDialog from './popup/UploadFile.jsx';
// import 'jquery-file-download';

export default class FileManager extends React.Component {

  constructor(props) {
    super(props);
    const path = '/';
    this.state = { path, filesList: [], selectedFiles: [] };

    // Save links to listener functions
    this.directoryLoaded = this.directoryLoadedListener.bind(this);
    this.directoryCreated = this.directoryCreatedListener.bind(this);
    this.fileDeleted = this.fileDeletedListener.bind(this);
  }

  componentDidMount() {
    // Set page titles
    dispatch(
      'page:titles:change', {
        pageTitle: 'File manager'
      }
    );

    // Dispatch command to load root directory
    dispatch('file-manager:directory:load', { path: this.state.path });

    // Rerender files list on directory fetch
    subscribe('file-manager:directory:loaded', this.directoryLoaded);

    // On directory created success event
    subscribe('file-manager:directory:created', this.directoryCreated);

    // On directory created success event
    subscribe('file-manager:file:deleted', this.fileDeleted);
  }

  componentWillUnmount() {
    unsubscribe('file-manager:directory:loaded', this.directoryLoaded);
    unsubscribe('file-manager:directory:created', this.directoryCreated);
    unsubscribe('file-manager:file:deleted', this.fileDeleted);
  }

  directoryLoadedListener(payload) {
    this.setState({
      path: payload.path,
      filesList: this.sortResult(payload.directoryFiles)
    });
    // Reset selected files on folder change
    this.resetSelectedFiles();
  }

  directoryCreatedListener(payload) {
    // Reload current directory
    dispatch('file-manager:directory:load', { path: this.state.path });

    // Close new directory dialog
    dispatch('popup:close');

    // Success directory create notification
    dispatch('notification:throw', {
      type: 'info',
      title: 'Directory created',
      message: 'Directory successfully created'
    });
  }

  fileDeletedListener(payload) {
    console.log(payload)
    // Reload current directory
    dispatch('file-manager:directory:load', { path: this.state.path });

    // Close new directory dialog
    dispatch('popup:close');

    // Success file deleted notification
    dispatch('notification:throw', {
      type: 'warning',
      title: 'Files deleted',
      message: 'Files successfully deleted'
    });
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.deleteFileDialog =
      <DeleteFileDialog
        onDeleteClick={this.handleDelete.bind(this)}
      />;

    this.newDirectoryDialog =
      <NewDirectoryDialog
        onCreateDirectoryClick={this.handleCreateDirectory.bind(this)}
        ref="newDirectoryDialog"
      />;

    this.uploadFileDialog =
      <UploadFileDialog
        ref="newDirectoryDialog"
        path={this.state.path}
      />;
  }

  /**
   * Reset selected files
   */
  resetSelectedFiles(data) {
    data = data || [];
    this.state.selectedFiles.forEach(file => file.setState({ selected: false }));
    this.setState({ selectedFiles: data });
    data.forEach(file => file.setState({ selected: true }));
  }

  /**
   * Check file name availability
   */
  validateFileName(name) {
    return !(name.trim() === '' || name.match(/[^\w\s\._-]/));
  }

  sortResult(result) {
    // Sort files by names asc
    let sortedList = (result || []).sort(
      (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );

    // Pin directories to top and move files to the bottom of the list
    return sortedList
      .filter(el => el.type === 'directory')
      .concat(
        sortedList.filter(
          el => el.type !== 'directory'
        )
      );
  }

  /**
   * Add file to selected files list
   * @param {FileView}
   */
  addToSelection(fileView) {
    this.setState({ selectedFiles: this.state.selectedFiles.concat(fileView) });
  }

  /**
   * Remove file from selected files list
   * @param {FileView}
   * @return Seleted files list
   */
  removeFromSelection(fileView) {
    this.resetSelectedFiles(
      this.getSeltectedFiles().filter(item => fileView.props.id !== item.props.id)
    );
  }

  /**
   * Add or delete frile form selected files list
   * @param {FileView}
   * @param {Boolean} true - to add file to selection or false - elsewhere
   */
  handleSelection(fileView, isSelected) {
    isSelected ? this.addToSelection(fileView) : this.removeFromSelection(fileView);
  }

  /**
   * Handler for file open (on double click)
   * @param {Object} file - file data
   */
  openFile(file) {
    const path = file.path.replace(/\/$/, '') + '/' + file.name;

    switch (file.type) {
      case 'directory':
        dispatch('file-manager:directory:load', { path });
      break;

      default:
        console.log('Not a directory:', file);
      break;
    }
  }

  /**
   * Function fires when file manager's icon delete clicked
   */
  deleteFiles() {
    if (this.state.selectedFiles.length === 0) {
      return ;
    }
    dispatch('popup:show', {
      title: 'Delete confirmation',
      body: this.deleteFileDialog
    });
  }

  handleDelete() {
    dispatch(
      'file-manager:file:delete', {
        name: this.state.selectedFiles.map((file) => {
          return file.props.file.name;
        }),
        path: this.state.path
      }
    );
  }

  uploadFiles() {
    dispatch('popup:show', {
      title: 'Drag & drop files for uploading',
      body: this.uploadFileDialog
    });
  }

  downloadFiles() {
    this.state.selectedFiles.map((fileView) => {
      let file = fileView.props.file;
      if (file.type === 'directory') {
        return false;
      }
      let downloadLink = config.backUrl + "/file/content?path=" + file.path + "&name="  + file.name;
      $.fileDownload(downloadLink);
    });
  }

  /**
   * Function fires when file manager's icon new directory clicked
   */
  createDirectory() {
    dispatch('popup:show', {
      title: 'New directory',
      body: this.newDirectoryDialog
    });
  }

  handleCreateDirectory() {
    let name = this.refs.newDirectoryDialog.directoryName.value;

    if (!this.validateFileName(name)) {
      dispatch('notification:throw', {
        title: 'New directory',
        message: 'Wrong directory name',
        type: 'danger'
      });
      return ;
    }
    dispatch('file-manager:directory:create', {
      path: this.state.path,
      name
    });
  }

  /**
   * Breadcumps path change event
   * @param {String} path - path to navigate file manager
   */
  pathChange(path) {
    // If navigating to current path
    if (this.state.path === path) {
      return false;
    }
    dispatch('file-manager:directory:load', { path });
  }

  /**
   * Get list of selected files
   * @return - selected files list
   */
  getSeltectedFiles() {
    return this.state.selectedFiles;
  }

  filterChange(e) {
    this.setState({
      filesList: this.sortResult(
        directoryFiles.filter(
          file => !!file.name.toLowerCase().match(e.target.value.toLowerCase())
        )
      )
    });
    this.resetSelectedFiles();
  }

  get filesList() {
    if (this.state.filesList.length === 0) {
      return (
        <div class="directory-list text-center" style={{ padding: '10px' }}>Nothing to display.</div>
      );
    }
    return (
      <div class="directory-list">
        {this.state.filesList.map((file, key) => {
          return (
              <FileView
                key={file.path + key}
                id={file.path + key}
                file={file}
                handleClick={this.handleSelection.bind(this)}
                handleDoubleClick={this.openFile.bind(this)}
              />
          );}
        )}
      </div>
    );
  }

  render() {
    let path = this.state.path.replace(/\/$/, '');

    // Initalizing file manager UI dialogs
    this.initDialogs();

    return (
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">Manage your lessons media content</h3>
        </div>
        <div class="box-body">
          <div class="file-manager clear">
            <div class="tool-bar clear">
              <ParentDir
                path={path}
                onDirectoryUp={this.pathChange.bind(this)}
              />
              <FileOperations
                selectedFiles={this.state.selectedFiles}
                onDeleteFiles={this.deleteFiles.bind(this)}
                onUploadFiles={this.uploadFiles.bind(this)}
                onDownloadFiles={this.downloadFiles.bind(this)}
                onCreateDirectory={this.createDirectory.bind(this)}
              />
              <Breadcumps
                path={path}
                onPathChange={this.pathChange.bind(this)}
              />
              <ViewChanger />
              <Filter
                onFilterChange={this.filterChange.bind(this)}
              />
            </div>
            {this.filesList}
          </div>
        </div>
      </div>
    );
  }
}
