export type Select = {
    type: 'select';
    table: string;
    columns: string[];
};

export type Where = {
    type: 'where';
    target: Query;
    expression: string;
};

export type Query = Select | Where;
