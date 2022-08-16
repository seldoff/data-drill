import {SortDirection} from '../model';

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

export type Query = {
    select: Select;
    where: Where;
    orderBy: OrderBy;
};
