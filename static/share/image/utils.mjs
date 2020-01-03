export const htmlEncode = (str) => {
  str = str.replace(/[^\x00-\x7F]/g, function (char) {
    let hex = char.charCodeAt(0).toString(16);
    while (hex.length < 4) hex = '0' + hex;

    return '&#x' + hex + ';';
  });

  return str;
};

export const jsonEncode = (str) => {
  str = str.replace(/[^\x00-\x7F]/g, function (char) {
    var hex = char.charCodeAt(0).toString(16);
    while (hex.length < 4) hex = '0' + hex;

    return '\\u' + hex;
  });

  return str;
};

export const convertVideoToBase64 = (url) => {
  return fetch(url)
    .then(response => response.blob())
    .then(data => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => reject;
        reader.readAsDataURL(data);
      })
    });
};