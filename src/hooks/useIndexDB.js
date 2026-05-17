import { openDB } from "idb";

export const DB_NAME = "open-library-db";
export const BOOK_STORE = "book_search";
export const AUTHOR_STORE = "author_search";
export const SHOWCASE_STORE = "showcase_data";
export const IMAGE_STORE = "image_cache";

const useIndexDB = (dbName) => {
  const getDb = async () => {
    const db = await openDB(dbName, 1, {
      upgrade(db) {
        const storesToCreate = [BOOK_STORE, AUTHOR_STORE, SHOWCASE_STORE, IMAGE_STORE];
        storesToCreate.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        });
      },
    });
    return db;
  };

  const getImage = async (key) => {
    const db = await getDb();
    return await db.get(IMAGE_STORE, key);
  };

  const getImages = async (keys) => {
    const db = await getDb();
    const tx = db.transaction(IMAGE_STORE, "readonly");
    const store = tx.objectStore(IMAGE_STORE);
    const imageBlobs = {};
    for (const key of keys) {
      const blob = await store.get(key);
      if (blob) {
        imageBlobs[key] = blob;
      }
    }
    return imageBlobs;
  };

  const cacheImage = async (key, blob) => {
    const db = await getDb();
    await db.put(IMAGE_STORE, blob, key);
  };

  const cacheImages = async (imagesObject) => {
    const db = await getDb();
    const tx = db.transaction(IMAGE_STORE, "readwrite");
    const store = tx.objectStore(IMAGE_STORE);
    await Promise.all(Object.entries(imagesObject).map(([key, blob]) => store.put(blob, key)));
    await tx.done;
  };

  const storeData = async (storeName, key, value) => {
    const db = await getDb();
    await db.put(storeName, value, key);
  };

  const retrieveData = async (storeName, key) => {
    const db = await getDb();
    return await db.get(storeName, key);
  };

  const deleteData = async (storeName, key) => {
    const db = await getDb();
    await db.delete(storeName, key);
  };

  const clearStore = async (storeName) => {
    try {
      const db = await getDb();
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
      console.log(`Store '${storeName}' cleared successfully.`);
    } catch (error) {
      console.error(`Failed to clear store '${storeName}':`, error);
    }
  };

  return {
    storeData,
    retrieveData,
    deleteData,
    clearStore,
    getImage,
    getImages,
    cacheImage,
    cacheImages,
  };
};

export default useIndexDB;
