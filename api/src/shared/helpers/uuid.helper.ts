export function uuid(length = 36): string {
  return (crypto.randomUUID().toString().replaceAll('-','')+crypto.randomUUID().replaceAll('-','')).substring(0,length)
}

export function token(length = 21): string {
  return uuid(length)
}

export function slugify(name) {
  const slugify = require('slugify')
  return slugify(name, {remove: /[*+~.()'"!:@\?#]/g, strict: true});
}

export const newsguuid = async (name, findById, append = '_') => {
  const checkIfExists = async (newId, findById) => {
    try {
      const found = await findById(newId)
      if (found) {
        return true;
      }
    } catch (exception) {
      return true;
    }
    return false;
  }

  let slug = slugify(name);
  let idExists = await checkIfExists(slug, findById)
  while (idExists) {
    slug = slugify(name + append);
    append = append + '_'
    idExists = await checkIfExists(slug, findById)
    if (append.length > 10) {
      slug = uuid()
      break;
    }
  }
  return slug;
}
