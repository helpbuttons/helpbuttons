import {memoryDatasource} from './memory.datasource'
import {postgresDatasource} from './postgres.datasource'

export const datasourceConfig = (process.env.NODE_ENV === 'postgres')  ? postgresDatasource : memoryDatasource;