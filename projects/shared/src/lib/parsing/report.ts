import { z } from 'zod';

export const ReportSchema = z.object({
    projects: z.object({
        name: z.string(),
        tags: z.object({
            name: z.string(),
            time: z.number()
        }).array(),
        time: z.number()
    }).array(),
    time: z.number(),
    timespan: z.object({
        from: z.string().transform( arg => new Date( arg ) ),
        to: z.string().transform( arg => new Date( arg ) )
    })
})

export type Report = z.output<typeof ReportSchema>;

export function convertToReport(json: string): Report {
    const obj = JSON.parse(json);
    return ReportSchema.parse(obj);
}