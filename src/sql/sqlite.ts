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

type CacheItem = {
    timestamp: Date;
    data: Result<QueryExecResult>;
};

type DatabaseCache = Map<string, CacheItem>;

const cache = new WeakMap<Database, DatabaseCache>();

function cleanCache(dbCache: DatabaseCache, now: Date) {
    const minTimestamp = now.getTime() - 60_000;
    for (const [key, item] of dbCache) {
        if (item.timestamp.getTime() < minTimestamp) {
            dbCache.delete(key);
        }
    }
}

function getFromCache(
    db: Database,
    query: string,
    allowedCacheAgeSeconds: number | undefined,
    factory: () => Result<QueryExecResult>
): Result<QueryExecResult> {
    let dbCache = cache.get(db);
    if (dbCache === undefined) {
        dbCache = new Map();
        cache.set(db, dbCache);
    }

    const now = new Date();

    cleanCache(dbCache, now);

    let cacheItem = dbCache.get(query);
    if (
        allowedCacheAgeSeconds === undefined ||
        cacheItem === undefined ||
        now.getTime() - cacheItem.timestamp.getTime() > allowedCacheAgeSeconds * 1000
    ) {
        const data = factory();
        if (data.successful) {
            cacheItem = {
                timestamp: now,
                data,
            };
            dbCache.set(query, cacheItem);
        }
        return data;
    }

    return cacheItem.data;
}

function executeQueryImpl(db: Database, query: string): Result<QueryExecResult> {
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

export function executeQuery(
    db: Database,
    query: string,
    allowedCacheAgeSeconds: number | undefined = 30
): Result<QueryExecResult> {
    return getFromCache(db, query, allowedCacheAgeSeconds, () => executeQueryImpl(db, query));
}
