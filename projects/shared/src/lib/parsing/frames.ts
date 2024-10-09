import { z } from 'zod';

const FrameTupleSchema = z.tuple([
    z.number().transform(s => new Date(s * 1000)),
    z.number().transform(e => new Date(e * 1000)),
    z.string(),
    z.string(),
    z.string().array(),
    z.number().nullable().transform(u => u ? new Date(u) : null)
]);
const FrameTupleFileSchema = FrameTupleSchema.array();

const FrameSchema = z.object({
    start: z.date(),
    stop: z.date(),
    project: z.string(),
    id: z.string(),
    tags: z.string().array(),
    lastUpdated: z.date().nullable()
})
const FrameFileSchema = FrameSchema.array();


type FrameTuple = z.output<typeof FrameTupleSchema>;
export type Frame = z.output<typeof FrameSchema>;
export type FrameFile = z.output<typeof FrameFileSchema>;

export function convertToFrame(json: string): Frame {
    const obj = JSON.parse(json)
    const frameTuple: FrameTuple = FrameTupleSchema.parse(obj);

    return convertFromFrameTupleToObject(frameTuple);
}

function convertFromFrameTupleToObject(tuple: FrameTuple): Frame {
    const newFrame: Frame = {
        start: tuple[0],
        stop: tuple[1],
        project: tuple[2],
        id: tuple[3],
        tags: tuple[4],
        lastUpdated: tuple[5],
    }

    return FrameSchema.parse(newFrame);
}

export function convertToFrameFile(json: string): FrameFile {
    const obj = JSON.parse(json)
    const frameTupleFile = FrameTupleFileSchema.parse(obj);

    return frameTupleFile.map(tuple => convertFromFrameTupleToObject(tuple));
}

