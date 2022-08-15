import sqlFactory, {Database, QueryExecResult} from 'sql.js';
import {Result} from '../utils';

const dbUrl =
    'https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite';

export async function connectToDb(): Promise<Database> {
    // noinspection JSUnusedGlobalSymbols
    const sqlPromise = sqlFactory({
        locateFile: file => `https://sql.js.org/dist/${file}`,
    });

    const dataPromise = fetch(dbUrl).then(r => r.arrayBuffer());

    return await Promise.all([sqlPromise, dataPromise]).then(([sql, data]) => {
        const db = new sql.Database(new Uint8Array(data));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
        (window as any).db = db;
        return db;
    });
}

export function executeQuery(db: Database, query: string): Result<QueryExecResult> {
    try {
        const data = db.exec(query)[0];
        console.log('executeQuery', query, data);
        return data !== undefined
            ? {successful: true, data}
            : {successful: false, message: 'Database returned no rows'};
    } catch (e: any) {
        const message: string =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            typeof e.message === 'string'
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  `Database error: "${e.message as string}"`
                : 'Unknown database error';
        console.log('executeQuery', query, message);
        return {successful: false, message};
    }
}
