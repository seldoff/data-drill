import sqlFactory, {Database} from 'sql.js';

const dbUrl =
    'https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite';

export async function connectToDb(): Promise<Database> {
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
