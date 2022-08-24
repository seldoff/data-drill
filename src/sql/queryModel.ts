import {AggregationFunc, SortDirection} from '../model';

export type Select = {
    table: string;
    columns: string[];
};

export type Where = {
    filters: string[];
};

export type OrderBy = {
    columns: string[];
    directions: SortDirection[];
};

export type Aggregation = {
    column: string;
    func: AggregationFunc;
    distinct: boolean;
};

export type Query = {
    select: Select;
    where: Where | undefined;
    orderBy: OrderBy | undefined;
    aggregation: Aggregation | undefined;
};
