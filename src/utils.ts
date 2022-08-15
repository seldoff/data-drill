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

export type OkResult<T> = {
    successful: true;
    data: T;
};

export type ErrorResult = {
    successful: false;
    message: string;
};

export type Result<T> = OkResult<T> | ErrorResult;

export function map<T1, T2>(result: Result<T1>, func: (d: T1) => T2): Result<T2> {
    if (result.successful) {
        return {
            successful: true,
            data: func(result.data),
        };
    }

    return result;
}

export function bind<T1, T2>(result: Result<T1>, func: (d: T1) => Result<T2>): Result<T2> {
    return result.successful ? func(result.data) : result;
}
