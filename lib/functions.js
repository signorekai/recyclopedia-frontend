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

export const checkHTTPMethod = (res, method, allowedMethods = ['GET']) => {
  if (allowedMethods.indexOf(method) === -1) {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
