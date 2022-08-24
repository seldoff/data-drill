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

export function flatMap<T1, T2>(result: Result<T1>, func: (d: T1) => Result<T2>): Result<T2> {
    return result.successful ? func(result.data) : result;
}

export function bind<T1, T2>(result: Result<T1>, func: (d: T1) => Result<T2>): Result<T2> {
    return result.successful ? func(result.data) : result;
}
