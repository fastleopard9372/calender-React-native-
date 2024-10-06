export interface NoteDTO {
    id: number;
    title: string;
    content: string;
    ownerId?: number;
    workspaceId?: number;
    createAt?: Date;
}

export interface NewNoteDTO {
    title: string;
    content: string;
    workspaceId?: number;
}

export interface UpdateNoteDTO {
    title?: string;
    content?: string;
}

export interface NotesOnWorkSpaces {
    id: number;
    title: string;
    notes: Array<NoteDTO>;
}