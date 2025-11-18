export type Embedding = number[] | Float32Array;

export interface Note {
  id?: string;
  title: string;
  body: string;
  embeddings?: Embedding;
}
