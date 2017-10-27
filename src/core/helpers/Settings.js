export default class Settings {

  static get data() {
    return JSON.parse(localStorage.getItem('settings'));
  }

  static set data(data) {
    localStorage.setItem('settings', JSON.stringify(data));
  }

  static apply(settings) {
    this.data = settings;
  }

  static get(field) {
    const data = JSON.parse(localStorage.getItem('settings'));

    return data[field];
  }
}
