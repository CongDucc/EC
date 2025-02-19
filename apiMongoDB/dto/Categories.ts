export interface CategoryObj {
    name: string;
    images?: string[];
}

export interface UpdateCategory {
    name?: string;
    images?: string[];
    id: string;
}

export interface CategoryResponse {
    _id: string;
    name: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}