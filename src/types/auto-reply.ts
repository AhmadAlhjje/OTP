export interface AutoReply {
  _id: string;
  keywords: string[];
  response: string;
}

export type NewAutoReply = Omit<AutoReply, "_id">;
