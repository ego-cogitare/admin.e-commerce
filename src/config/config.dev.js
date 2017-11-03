module.exports = {
  backUrl: 'http://api.e-commerce.loc',
  frontUrl: 'http://admin.e-commerce.loc',
  staticFiles: '/uploads',
  trumbowyg: {
    semantic: false,
    removeformatPasted: true,
    btnsDef: {
      align: {
        dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ico: 'justifyLeft'
      },
      lists: {
        dropdown: ['unorderedList', 'orderedList'],
        ico: 'unorderedList'
      },
      styles: {
        dropdown: ['strong', 'em', 'del', 'underline'],
        ico: 'strong'
      },
      scripts: {
        dropdown: ['superscript', 'subscript'],
        ico: 'superscript'
      }
    },
    btns: [
      ['viewHTML'],
      ['formatting'],
      ['styles'],
      ['link'],
      ['scripts'],
      ['align'],
      ['lists'],
      ['foreColor', 'backColor'],
      ['horizontalRule'],
      ['removeformat']
    ]
  }
};
