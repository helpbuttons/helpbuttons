export function uuid(length = 36): string {
  return (crypto.randomUUID().toString().replaceAll('-','')+crypto.randomUUID().replaceAll('-','')).substring(0,length)
}

export function token(length = 21): string {
  return uuid(length)
}