import type { Directory, Note } from './note';

export interface DirectoryGroup {
  directory: Directory;
  notes: Note[];
}

export interface DirectoryStructure {
  root: DirectoryGroup;
  children: DirectoryStructure[];
}
