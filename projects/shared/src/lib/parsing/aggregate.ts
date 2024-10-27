import { z } from 'zod';

import { ReportSchema } from './report';

const AggregateSchema = ReportSchema.array();

export type Aggregate = z.output<typeof AggregateSchema>;

export function convertToAggregate(json: string): Aggregate {
    const obj = JSON.parse(json);
    return AggregateSchema.parse(obj);
}