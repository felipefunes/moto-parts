export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  description?: string;
  iconKey?: string;
  imageUrl?: string;
}
