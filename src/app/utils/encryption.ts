export function encodeData(data: any): string {
  const jsonString = JSON.stringify(data);
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(jsonString)));
  }
  return Buffer.from(jsonString).toString('base64');
}

export function decodeData(encodedData: string): any {
  let jsonString;
  if (typeof window !== 'undefined') {
    jsonString = decodeURIComponent(escape(atob(encodedData)));
  } else {
    jsonString = Buffer.from(encodedData, 'base64').toString();
  }
  return JSON.parse(jsonString);
}
