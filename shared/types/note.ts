export type Embedding = number[] | Float32Array;
export type SaveStatus = 'saved' | 'pending' | 'failed' | null;
export type SyncStatus =
  | 'downloading'
  | 'uploading'
  | 'synced'
  | 'disabled'
  | null;
export type DeleteStatus = 'deleting' | 'deleted' | 'failed' | null;

export interface Note {
  id: string | null;
  title: string | null;
  body: string;
  embeddings?: Embedding;
  saveStatus?: SaveStatus;
  syncStatus?: SyncStatus;
  deleteStatus?: DeleteStatus;
}
