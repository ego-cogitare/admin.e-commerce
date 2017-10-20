export function buildUrl(file) {
  return config.backUrl + '/file/content?path=' + file.path + '&name=' + file.name;
};
