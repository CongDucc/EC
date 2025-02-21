export interface ProductListParams {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryItem {
    _id: string;
    name: string;
    images: string[];
}

export interface CategoryStyleProps {
    width: number;
    height: number;
    radius: number;
    resizeMode: "cover" | "contain" | "stretch" | "center";
}

export interface CategoryCardProps {
    activeCat?: string;
    onPress: () => void;
}

export interface Props {
    item: CategoryItem;
    catStyleProps: CategoryStyleProps;
    catProps: CategoryCardProps;
}

export interface CategoryParams {
    _id: string;
    name: string;
    images: string[];
}