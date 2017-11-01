import React from 'react';
import { buildUrl } from '../../core/helpers/Utils';

export default class PicturesList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pictures: this.props.pictures || [],
      activePictureId: this.props.activePictureId || '',
    };
  }

  componentWillReceiveProps({ activePictureId, pictures }) {
    this.setState({ activePictureId, pictures });
  }

  pictureSelectHandler(picture) {
    this.props.onSelect(picture);
  }

  render() {
    return (
      <div class={this.props.className}>
        {
          this.state.pictures.map((picture) => {
            return (
              <div
                key={picture.id}
                onClick={this.pictureSelectHandler.bind(this, picture)}
                class={`${this.props.pictureClassName}${(this.state.activePictureId === picture.id) ? ' selected' : ''}`}>
                <img src={`${buildUrl(picture)}`} alt={picture.name} />
              </div>
            );
          })
        }
        {
          this.props.addPictureControll &&
          <div class={`${this.props.pictureClassName} empty`} onClick={this.props.addPictureCallback}>+</div>
        }
      </div>
    );
  }
}
