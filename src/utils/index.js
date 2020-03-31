/**
 * selectFile 选择本地文件
 * @param {*} typeArray 所有支持的类型
 * @param {*} multiple 是否选择多文件
 */
export const importFile = (typeArray = [], multiple = false) => {
  return new Promise((resolve, reject) => {
    const typeStr = typeArray.length ? typeArray.join(',') : '*';
    var el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', typeStr);
    el.setAttribute('multiple', multiple);
    el.style.display = 'none';
    el.addEventListener('change', function(e) {
      if (multiple) {
        resolve(e.target.files);
      } else {
        resolve(e.target.files[0]);
      }
      document.body.removeChild(e.target);
    });
    document.body.appendChild(el);

    el.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      }),
    );
  });
};

export const dataURLtoBlob = function(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

//将blob转换为file
export const blobToFile = function(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};
