import React from 'react';

export default class FileView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  mapFileExt(ext) {
    let extMap = {
      directory : 'directory.png',
      pdf       : 'pdf.png',
      mp4       : 'mpeg.png',
      mpg       : 'mpeg.png',
      avi       : 'avi.png',
      webm      : 'video-default.png',
     '3gp'      : '3gp.png',
      mov       : 'mov.png',
      wmv       : 'wmv.png',
      flv       : 'video-default.png',
      txt       : 'txt.png',
      mp3       : 'mp3.png',
      ogg       : 'audio.png',
      flac      : 'audio.png',
      wma       : 'wma.png',
      wav       : 'wav.png',
      default   : 'default.png',
    };
    return extMap[ext] || extMap.default;
  }

  handleClick() {
    this.setState({ selected: !this.state.selected });
    return this.props.handleClick(this, !this.state.selected);
  }

  handleDoubleClick() {
    return this.props.handleDoubleClick(this.props.file);
  }

  render() {
    let className = 'file' + (this.state.selected ? ' selected' : '');
    let inlineStyles = {};

    if (['jpeg', 'jpg', 'gif', 'png', 'bmp', 'tga', 'tiff'].indexOf(this.props.file.type.toLowerCase()) !== -1) {
      inlineStyles = {
        backgroundImage: "url('" + config.backUrl + "/file/content?path=" + this.props.file.path + "&name="  + this.props.file.name + "')",
        backgroundSize: "cover"
      };
    }
    else {
      inlineStyles = {
        backgroundImage: "url('"
          + config.staticFiles
          + "icons/file-manager/"
          + this.mapFileExt(this.props.file.type)
          + "')"
      };
    }

    return (
      <div class={className} title={this.props.file.name}
           onClick={this.handleClick.bind(this)}
           onDoubleClick={this.handleDoubleClick.bind(this)}
      >
        <div class="type-icon" style={inlineStyles}></div>
        <div class="title">
          {this.props.file.name}
        </div>
      </div>
    );
  }
}
