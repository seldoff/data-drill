import {Database} from 'sql.js';
import {getOrCreate} from './utils';

export type ColumnSchema = {
    name: string;
    type: string;
    notNull: boolean;
};

export type TableSchema = {
    name: string;
    columns: ColumnSchema[];
};

export type Schema = TableSchema[];

export function buildSchema(db: Database): Schema {
    const schema = new Map<string, TableSchema>();
    db.exec(
        "SELECT m.name, p.name, p.type, p.'notnull' FROM sqlite_master m LEFT OUTER JOIN pragma_table_info((m.name)) p on m.name <> p.name WHERE m.type = 'table'"
    )[0].values.reduce((acc, row) => {
        const tableName = row[0] as string;
        const columnName = row[1] as string;
        const columnType = row[2] as string;
        const notNull = row[3] as number;

        const tableSchema: TableSchema = getOrCreate(acc, tableName, () => ({
            name: tableName,
            columns: [],
        }));

        tableSchema.columns.push({
            name: columnName,
            type: columnType,
            notNull: notNull === 1,
        });

        return acc;
    }, schema);

    const result = Array.from(schema.values());

    const cmp = <T extends {name: string}>(x: T, y: T) => x.name.localeCompare(y.name);
    result.sort(cmp);
    for (const table of result) {
        table.columns.sort(cmp);
    }
    return result;
}
