export function parseBooleanOrUndefined(value?: string): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const lowerValue = String(value).toLowerCase();

  if (lowerValue === 'true') {
    return true;
  }

  if (lowerValue === 'false') {
    return false;
  }

  return undefined;
}
