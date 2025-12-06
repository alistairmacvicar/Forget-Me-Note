import { db } from '~~/plugins/db.client';

const isUnique = async (path: string) => {
  const unique =
    (await db.directories.where('path').equalsIgnoreCase(path).count()) === 0;

  return unique;
};

const normalisePath = (path: string) => {
  return path[path.length - 1] === '/' ? path : `${path}/`;
};

export const onCreateDirectory = async (path: string) => {
  const normalisedPath = normalisePath(path);
  const unique = await isUnique(normalisedPath);

  if (unique) {
    await db.directories.add({ path });
  }

  return unique;
};

export const onDeleteDirectory = async (id: string) => {
  const result = await db.directories.delete(id);
};

export const onUpdateDirectory = async (id: string, path: string) => {
  const normalisedPath = normalisePath(path);
  const unique = await isUnique(normalisedPath);

  if (unique) {
    await db.directories.update(id, { path });
  }

  return unique;
};

export const onGetRootDirectory = async () => {
  const result = await db.directories
    .where('path')
    .equalsIgnoreCase('~/')
    .toArray();
  const directoryId = result[0]!.id;

  console.log(directoryId);

  return directoryId;
};
