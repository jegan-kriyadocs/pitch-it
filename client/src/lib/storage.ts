const DATABASE_NAME = 'pitch-it'
const DATABASE_VERSION = 1
const CHUNK_STORE = 'recordingChunks'
const META_STORE = 'recordingMeta'
const META_KEY = 'current'

interface RecordingMeta {
  mimeType: string
  durationSeconds: number
}

export interface RecoveredRecording {
  blob: Blob
  durationSeconds: number
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'))
      return
    }
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(CHUNK_STORE, { autoIncrement: true })
      request.result.createObjectStore(META_STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStores<T>(
  mode: IDBTransactionMode,
  run: (chunks: IDBObjectStore, meta: IDBObjectStore) => Promise<T>,
) {
  const database = await openDatabase()
  try {
    const transaction = database.transaction([CHUNK_STORE, META_STORE], mode)
    return await run(transaction.objectStore(CHUNK_STORE), transaction.objectStore(META_STORE))
  } finally {
    database.close()
  }
}

export function saveRecordingChunk(chunk: Blob, meta: RecordingMeta) {
  return withStores('readwrite', async (chunks, metaStore) => {
    await Promise.all([
      requestToPromise(chunks.add(chunk)),
      requestToPromise(metaStore.put(meta, META_KEY)),
    ])
  })
}

export function loadRecoveredRecording() {
  return withStores('readonly', async (chunks, metaStore) => {
    const [storedChunks, meta] = await Promise.all([
      requestToPromise(chunks.getAll() as IDBRequest<Blob[]>),
      requestToPromise(metaStore.get(META_KEY) as IDBRequest<RecordingMeta | undefined>),
    ])
    if (!meta || storedChunks.length === 0) {
      return null
    }
    const recovered: RecoveredRecording = {
      blob: new Blob(storedChunks, { type: meta.mimeType }),
      durationSeconds: meta.durationSeconds,
    }
    return recovered
  })
}

export function clearRecording() {
  return withStores('readwrite', async (chunks, metaStore) => {
    await Promise.all([requestToPromise(chunks.clear()), requestToPromise(metaStore.clear())])
  }).catch(() => undefined)
}
