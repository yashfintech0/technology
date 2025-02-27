export interface CategoryItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
}

export interface Category extends CategoryItem {
  subcategories: CategoryItem[];
}
