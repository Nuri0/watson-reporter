import { z } from 'zod';

const LogSchema = z.object({
    id: z.string(),
    start: z.string().transform(d => new Date(d)),
    stop: z.string().transform(d => new Date(d)),
    project: z.string(),
    tags: z.string().array()
})

export type Log = z.output<typeof LogSchema>;

export function convertToLogs(json: string): Array<Log> {
    const obj = JSON.parse(json);
    return LogSchema.array().parse(obj);
}