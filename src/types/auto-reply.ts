export interface AutoReply {
  _id: string;
  keyword: string;
  response: string;
}

export type NewAutoReply = Omit<AutoReply, "_id">;

