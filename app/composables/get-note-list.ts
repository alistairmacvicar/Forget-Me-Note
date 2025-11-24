import type {
  DirectoryGroup,
  DirectoryStructure,
} from '~~/shared/types/directory-group';
import { db } from '~~/plugins/db.client';

const insertDirectory = (
  loneDirectory: DirectoryStructure,
  parentDirectory: DirectoryStructure,
) => {
  let found = false;
  const children = parentDirectory.children;
  const desiredParent = loneDirectory.root.directory.parent;
  const currentDirectory = parentDirectory.root.directory;

  if (!found) {
    if (currentDirectory === desiredParent) {
      found = true;
      parentDirectory.children.push(loneDirectory);
    } else if (children.length > 0) {
      for (const child of children) {
        const result: {
          directoryStructure: DirectoryStructure;
          found: boolean;
        } = insertDirectory(loneDirectory, child);
        found = result.found;
        parentDirectory = result.directoryStructure;
      }
    }
  }

  return { directoryStructure: parentDirectory, found };
};

const sortDirectoryStructure = (directoryMap: Map<string, DirectoryGroup>) => {
  let sortedDirectories: DirectoryStructure = {
    root: directoryMap.get('~/') || {
      directory: { name: '~/', parent: null },
      notes: [],
    },
    children: [],
  };

  directoryMap.delete('~/');

  const directories = directoryMap
    .values()
    .toArray()
    .map((directory) => {
      return {
        root: directory,
        children: [],
      };
    });

  for (const directory of directories) {
    const result = insertDirectory(directory, sortedDirectories);

    if (result.found) {
      sortedDirectories = result.directoryStructure;
    } else {
      sortedDirectories.children.push(directory);
    }
  }

  return sortedDirectories;
};

export const getAllNotes = async (): Promise<DirectoryStructure> => {
  const query = await db.notes.toArray();
  const notes = query.map((note) => ({
    id: note.id,
    title: note.title,
    directory: note.directory,
  }));
  const directoryMap = new Map<string, DirectoryGroup>();

  for (const note of notes) {
    const directory = note.directory;
    if (!directoryMap.has(directory.name)) {
      directoryMap.set(directory.name, { directory, notes: [note] });
    } else {
      directoryMap.get(directory.name)?.notes.push(note);
    }
  }

  const sortedDirectories = sortDirectoryStructure(directoryMap);

  return sortedDirectories;
};
