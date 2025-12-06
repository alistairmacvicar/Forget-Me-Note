import type { TreeItem } from '@nuxt/ui';
import { db } from '~~/plugins/db.client';

const buildDirectoryPath = (path: string, depth: number) => {
  const directories = path.split('/').filter(Boolean);
  const directory = `${directories[depth]}/`;

  return directory;
};

const buildFullDirectoryPath = (path: string, depth: number) => {
  const directories = path.split('/').filter(Boolean);
  const pathSegments = directories.slice(0, depth + 1);
  const fullPath = '~/' + pathSegments.join('/') + '/';

  return fullPath;
};

const buildNoteItems = (notes: Note[]): TreeItem[] => {
  const items = new Array<TreeItem>();

  for (const note of notes) {
    const item: TreeItem = {
      label: note.title || 'My Note',
      key: note.id,
    };

    items.push(item);
  }

  return items;
};

const sortTreeItems = (items: TreeItem[]): TreeItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.sort((a, b) => {
    const aHasChildren =
      a.children && Array.isArray(a.children) && a.children.length > 0;
    const bHasChildren =
      b.children && Array.isArray(b.children) && b.children.length > 0;

    if (aHasChildren && !bHasChildren) return -1;
    if (!aHasChildren && bHasChildren) return 1;

    const aLabel = String(a.label || '');
    const bLabel = String(b.label || '');
    return aLabel.localeCompare(bLabel);
  });
};

const buildFileSystem = async (
  item: TreeItem,
  path: string,
  notes: TreeItem[],
  depth: number = 0,
): Promise<TreeItem> => {
  let exists = false;
  const maxDepth = path.split('/').filter(Boolean).length - 1;
  const directory = buildDirectoryPath(path, depth);
  const fullPath = buildFullDirectoryPath(path, depth);

  const pathSegments = path.split('/').filter(Boolean);
  if (depth >= pathSegments.length) {
    return item;
  }

  const result = await db.directories.where('path').equals(fullPath).toArray();
  const directoryId = result[0]?.id;
  const newItem: TreeItem = {
    label: directory,
    key: directoryId,
    children: [],
  };

  item.children = item.children || [];
  const children = item.children as TreeItem[];

  if (item.label === directory) {
    exists = true;

    if (depth === maxDepth) {
      if (notes.length > 0) {
        children.push(...notes);
      } else {
        children.push({
          label: '+ Create new note',
          key: `create-note-${directoryId}`,
        });
      }
    } else {
      item = await buildFileSystem(item, path, notes, depth + 1);
    }

    return item;
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i] as TreeItem;

    if (child.label === directory) {
      exists = true;
      child.children = child.children || [];

      if (depth === maxDepth) {
        if (notes.length > 0) {
          child.children.push(...notes);
        } else {
          child.children.push({
            label: '+ Create new note',
            key: `create-note-${directoryId}`,
          });
        }
        return item;
      } else {
        children[i] = await buildFileSystem(child, path, notes, depth + 1);
      }

      break;
    }
  }

  if (!exists) {
    if (depth === maxDepth) {
      if (notes.length > 0) {
        newItem.children = notes;
      } else {
        newItem.children = [
          {
            label: '+ Create new note',
            key: `create-note-${directoryId}`,
          },
        ];
      }
      children.push(newItem);
    } else {
      const builtItem = await buildFileSystem(newItem, path, notes, depth + 1);
      children.push(builtItem);
    }
  }

  return item;
};

export const getFileSystem = async (): Promise<TreeItem[]> => {
  const notes: Note[] = await db.notes.toArray();
  const directories: Directory[] = await db.directories.toArray();
  const directoryPaths = new Map<string, string>();
  const directoryStructure = new Map<string, Note[]>();
  const rootResult = await db.directories.where('path').equals('~/').toArray();
  const rootDirectoryId = rootResult[0]?.id;
  const fileSystem: TreeItem = {
    label: '~/',
    key: rootDirectoryId,
    children: [],
  };

  for (const directory of directories) {
    directoryStructure.set(directory.id, []);
    directoryPaths.set(directory.id, directory.path);
  }

  for (const note of notes) {
    if (note.directoryId && directoryStructure.has(note.directoryId)) {
      const children = directoryStructure.get(note.directoryId);
      if (children) {
        children.push(note);
      }

      directoryStructure.set(note.directoryId, children || []);
    }
  }

  const directoryIds = directoryStructure.keys().toArray();

  for (const directoryId of directoryIds) {
    const path = directoryPaths.get(directoryId);

    if (path === '~/') continue;

    if (path) {
      const children = buildNoteItems(
        directoryStructure.get(directoryId) || [],
      );

      await buildFileSystem(fileSystem, path, children);
    }
  }

  if (rootDirectoryId && directoryStructure.has(rootDirectoryId)) {
    const rootNotes = buildNoteItems(
      directoryStructure.get(rootDirectoryId) || [],
    );
    fileSystem.children = fileSystem.children || [];
    (fileSystem.children as TreeItem[]).push(...rootNotes);
  }

  if (fileSystem.children?.length === 0) {
    fileSystem.children = [
      {
        label: '+ Create new note',
        key: `create-note-${rootDirectoryId}`,
      },
    ];
  }

  const sortRecursively = (item: TreeItem) => {
    if (
      item.children &&
      Array.isArray(item.children) &&
      item.children.length > 0
    ) {
      item.children = sortTreeItems(item.children as TreeItem[]);
      for (const child of item.children) {
        if (child && typeof child === 'object') {
          sortRecursively(child as TreeItem);
        }
      }
    }
  };

  sortRecursively(fileSystem);

  return [fileSystem];
};
