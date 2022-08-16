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

export function patchConsoleForFlow() {
    const oldWarn = console.warn;
    console.warn = function (message: string, ...args) {
        if (
            message ===
            '[React Flow]: The React Flow parent container needs a width and a height to render the graph. Help: https://reactflow.dev/error#400'
        ) {
            return;
        }
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        oldWarn.apply(console, [message, ...args]);
    };
}

export function getExceptionMessage(e: any): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return typeof e.message === 'string' ? e.message : undefined;
}

export class WhileLoopInfiniteCycleGuard {
    private counter = 0;

    public iteration() {
        this.counter++;
        if (this.counter > 1000) {
            throw new Error('Possible infinite loop detected');
        }
    }
}
