export default class User {

  static get data() {
    return JSON.parse(localStorage.getItem('user'));
  }

  static set data(data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  static get fullName() {
    return (this.data.firstname || '')  + ' '  + (this.data.lastname || '');
  }
}
