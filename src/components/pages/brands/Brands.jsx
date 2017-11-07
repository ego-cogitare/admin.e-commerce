import React from 'react';
import { Link } from 'react-router';
import PowerTable from '../../widgets/PowerTable.jsx';
import DeleteBrandDialog from './popups/DeleteBrandDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, remove } from '../../../actions/Brand';

export default class Brands extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Brands list
      brands: []
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление брэндами'
    });

    // Get brands list
    list({},
      (brands) => this.setState({ brands }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  initDialogs() {
    this.deleteBrandDialog = <DeleteBrandDialog onDeleteClick={this._deleteBrand.bind(this)} />;
  }

  get columns() {
    return [
      { name: 'picture', width: 5, display: 'Лого', sort: false, renderer: (row) => {
        if (!row.pictureId) {
          return null;
        }
        return (
          <img
            width="45"
            height="30"
            src={buildUrl(row.pictures.filter(({id}) => id===row.pictureId)[0])}
            style={{ objectFit: 'contain' }}
          />
        );
      } },
      { name: 'title', display: 'Брэнд', sort: true },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return (
          <Link to={`brand/${row.id}`}><span class="fa fa-edit"></span></Link>
        );
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return (
          <a href="#" onClick={this.deleteBrandHandler.bind(this, row)}><span class="fa fa-trash"></span></a>
        );
      } },
    ];
  }

  deleteBrandHandler(brand, e) {
    e.preventDefault();

    this.brandToDelete = brand;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteBrandDialog
    });
  }

  _deleteBrand() {
    dispatch('popup:close');

    remove(this.brandToDelete,
      (r) => {
        this.setState({
          mode: 'add',
          brands: this.state.brands.filter(({id}) => id !== this.brandToDelete.id),
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Брэнд успешно удален'
        });
      },
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список брэндов</h3>
            </div>
            <div class="box-body">
              <div class="col-sm-12">
                <div class="row">
                  <PowerTable
                    header={true}
                    footer={true}
                    columns={this.columns}
                    data={this.state.brands}
                  >Список продуктов пуст</PowerTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
