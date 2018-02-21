export function buildUrl(file) {
  file = file || {};
  return `${config.backUrl}${file.path}/${file.name}`;
};
