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
    el.addEventListener('change', function (e) {
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

export const dataURLtoBlob = function (dataurl) {
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
export const blobToFile = function (theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

// cookie转json
export const cookieToJson = cookie => {
  let cookieArr = cookie.split(';');
  let obj = {};
  cookieArr.forEach(i => {
    let arr = i.split('=');
    obj[arr[0].trim()] = arr[1].trim();
  });
  return obj;
};


/**
 * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
 * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
 *
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF
   00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
 * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
 *
 * 注: Unicode在范围 D800-DFFF 中不存在任何字符
 *
 {@link <a
  onclick="javascript:pageTracker._trackPageview('/outgoing/zh.wikipedia.org/wiki/UTF-8');"

  href="http://zh.wikipedia.org/wiki/UTF-8">http://zh.wikipedia.org/wiki/UTF-8</a>}
   *
   * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
   * 000000 - 00FFFF  两个字节
   * 010000 - 10FFFF  四个字节
   *
   *
   {@link <a
  onclick="javascript:pageTracker._trackPageview('/outgoing/zh.wikipedia.org/wiki/UTF-16');"

  href="http://zh.wikipedia.org/wiki/UTF-16">http://zh.wikipedia.org/wiki/UTF-16</a>}
   * @param  {String} str
   * @param  {String} charset utf-8, utf-16
   * @return {Number}
   */
export const sizeofString = (str, charset) => {
  var total = 0,
    charCode,
    i,
    len;
  charset = charset ? charset.toLowerCase() : '';
  if (charset === 'utf-16' || charset === 'utf16') {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0xffff) {
        total += 2;
      } else {
        total += 4;
      }
    }
  } else {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
      }
    }
  }
  return total;
}
