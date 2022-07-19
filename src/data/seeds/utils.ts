import { Connection } from 'typeorm'

export function insert(connection: Connection, entity: any, values: any) {
    return connection
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values([
        values
      ])
      .execute()
}
