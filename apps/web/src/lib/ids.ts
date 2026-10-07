const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Gate for any id that ends up in a URL path or API call. */
export function isUuid(value: string): boolean {
  return UUID.test(value);
}
