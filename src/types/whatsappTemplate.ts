export interface APITemplate {
  _id: string;
  id: string;
  name: string;
  content: string;
  createdAt?: string;
  type?: string;
  tags?: string[];
}