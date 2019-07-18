const _toString = Object.prototype.toString;
const _hasOwnProperty = Object.prototype.hasOwnProperty;

export function isPlaintObject(value: any): boolean {
  return (
    value !== null &&
    value !== undefined &&
    _toString.call(value) === "[object Object]"
  );
}

export function hasProp(obj: Object | Array<any>, key: string) {
  return _hasOwnProperty.call(obj, key);
}
