import React from 'react';
import className from 'classnames';
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
                class={className(this.props.pictureClassName, { selected: this.state.activePictureId === picture.id })}>
                { /* If delete picture option is defined */
                  this.props.deletePictureControll &&
                  <i class="fa fa-trash btn btn-sm btn-primary icon-delete" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.props.deletePictureCallback(picture);
                  }}></i>
                }
                <img src={`${buildUrl(picture)}`} alt={picture.name} />
              </div>
            );
          })
        }
        { /* If add picture option is defined */
          this.props.addPictureControll &&
          <div class={className(this.props.pictureClassName, 'empty')} onClick={this.props.addPictureCallback}>+</div>
        }
      </div>
    );
  }
}
