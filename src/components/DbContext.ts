import React from 'react';
import {Database} from 'sql.js';

export const DbContext = React.createContext<Database | undefined>(undefined);
