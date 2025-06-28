export type NewAutoReply = Omit<AutoReply, "_id">;

export interface AutoReply {
  _id?: string;
  keywords: string[];
  response: string;
}

export interface ReplyGroup {
  keywords: string[];
  response: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableRow {
  [key: string]: any;
}
