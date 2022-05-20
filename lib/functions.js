export const capitalise = (string) => {
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
