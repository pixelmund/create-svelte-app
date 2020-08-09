export function createPackageName(name: string) {
  return name.trim().split(' ').join('-').toLowerCase();
}
