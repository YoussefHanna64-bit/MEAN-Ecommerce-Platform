export interface Category{
    title: string,
    _id: string,
    description: string,
     __v?: number;
}
export interface CategoryResponse{
    status: string,
    data?: {
        categories: Category[]
    },
}
