import { parse } from 'node-html-parser';

export const capitalise = (string) => {
  if (typeof string !== 'string' || string.length === 0) return string;

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const arrayOfResponsiveImages = [
  'xlarge',
  'large',
  'medium',
  'small',
  'thumbnail',
];

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
  const starting = arrayOfResponsiveImages.indexOf(maxSize);
  const ending = arrayOfResponsiveImages.indexOf(minSize);

  let url = imageObj.url;
  if (starting === -1) return false;

  for (let x = starting; x <= ending; x++) {
    if (
      imageObj.formats &&
      imageObj.formats.hasOwnProperty(arrayOfResponsiveImages[x])
    ) {
      url = imageObj.formats[arrayOfResponsiveImages[x]].url;
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

export const addMissingTitleToImg = (string) => {
  const doc = parse(string);
  const missingTitleImgs = doc.querySelectorAll('img:not([title])');
  for (const img of missingTitleImgs) {
    if (typeof img.getAttribute('alt') !== 'undefined') {
      img.setAttribute('title', img.getAttribute('alt'));
    }
  }
  return doc.toString();
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
