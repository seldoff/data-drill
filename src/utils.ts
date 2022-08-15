import {v4} from 'uuid';

export function getOrCreate<TK, TV>(map: Map<TK, TV>, key: TK, factory: () => TV): TV {
    let value = map.get(key);
    if (value === undefined) {
        value = factory();
        map.set(key, value);
    }
    return value;
}

export function uuid(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return v4();
}
