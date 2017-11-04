module.exports = {
  lang: 'ru',
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
    },
    image: {
      dropdown: ['insertImage', 'upload'],
      ico: 'insertImage'
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
    ['image'],
    ['table'],
    ['horizontalRule'],
    ['removeformat']
  ],
  plugins: {
    upload: {
      serverPath: 'https://api.imgur.com/3/image',
      fileFieldName: 'image',
      headers: {
        'Authorization': 'Client-ID 1c0c53041cfcaa8'
      },
      urlPropertyName: 'data.link'
    }
  }
};
