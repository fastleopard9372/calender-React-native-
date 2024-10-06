export interface LibraryDTO {
    id: number;
    type: LibraryFileType;
    originName: string;
    fileName: string;
    mimeType: string;
    ownerId: number;
    createAt: Date;
    updateAt: Date;
}

export enum LibraryFileType {
    DOC = 'DOC',
    MEDIA = 'MEDIA'
}