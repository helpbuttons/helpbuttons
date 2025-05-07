import { randomUUID } from 'crypto';

/**
 * @description misunderstand free alphabets and number to generate id for a better UX
 */
const PUBLIC_ID_SEED =
  '_-acdfghjklpqrstuvwxyz123456789ACDFGHJKLPQRSTUVWXYZ';

export function publicNanoidGenerator(length = 21): string {
  return randomUUID()
}

/**
 * @description length is the dominant predefined length for id in the prisma.schema
 */
export function dbIdGenerator(length = 36): string {
  return randomUUID()
}
