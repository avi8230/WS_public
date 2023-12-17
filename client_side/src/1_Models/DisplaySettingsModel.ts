export enum SortBy {
    Alphabetically,
    Score,
    Date,
    Category,
    Random
}

export enum InOrder {
    Descending,
    Ascending,
}

export enum Picture {
    All,
    WithPicture,
    WithoutPicture
}

export interface DisplaySettingsModel {
    sort: {
        sortBy: SortBy;
        inOrder: InOrder;
    }
    select: {
        category: string;
        picture: Picture;
        score: {
            fromScore: number;
            toScore: number;
        };
        date: {
            fromDate: string;
            toDate: string;
        };
    };
    search: string;
}