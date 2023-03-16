export const capitalise = (string) => {
  if (typeof string !== 'string' || string.length === 0) return string;

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const debounce = (func, delay = 300) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, delay);
  };
};

/**
 * @typedef {'large'|'medium'|'small'|'thumbnail'} imageSizes
 */
/**
 *
 * @param {*} imageObj
 * @param {imageSizes} maxSize
 * @param {imageSizes} minSize
 * @returns
 */
export const getLargestPossibleImage = (
  imageObj,
  maxSize,
  minSize = 'thumbnail',
) => {
  const arrayOfSizes = ['large', 'medium', 'small', 'thumbnail'];
  const starting = arrayOfSizes.indexOf(maxSize);
  const ending = arrayOfSizes.indexOf(minSize);

  let url = imageObj.url;
  if (starting === -1) return false;

  for (let x = starting; x <= ending; x++) {
    if (imageObj.formats && imageObj.formats.hasOwnProperty(arrayOfSizes[x])) {
      url = imageObj.formats[arrayOfSizes[x]].url;
      break;
    }
  }

  return replaceCDNUri(url);
};

export const checkHTTPMethod = (res, method, allowedMethods = ['GET']) => {
  if (allowedMethods.indexOf(method) === -1) {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export const replaceCDNUri = (string) => {
  return string.replace(
    /recyclopedia.ap-south-1.linodeobjects.com/g,
    'cdn.recyclopedia.sg',
  );
};

export const parentsUntil = (elem, selector) => {
  const limiter =
    selector === undefined
      ? document
      : typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

  let parents = [];
  let p = elem.parentNode;

  while (p !== limiter && p !== null) {
    const o = p;
    parents.push(o);
    p = o.parentNode;
  }

  if (p === limiter) {
    parents.push(limiter);
  }

  return parents;
};

export const replaceText = (originalString, options) => {
  let text = originalString;

  for (let option of options) {
    if (Array.isArray(option) && option.length === 2) {
      text = text.replace(option[0], option[1]);
    }
  }

  return text;
};
