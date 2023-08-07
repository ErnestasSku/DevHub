type IStorage = {
  count: number;
};

const defaultStorage: IStorage = {
  count: 0,
};

type IFeatures = {
  task_link: boolean;
  tauri_integration: boolean;
  requests: boolean;
  experimental: boolean;
};

const defaultFeatures: IFeatures = {
  task_link: true,
  tauri_integration: false,
  requests: false,
  experimental: false,
};

export const features = {
  get: (): Promise<IFeatures> =>
    chrome.storage.sync.get(defaultFeatures) as Promise<IFeatures>,
  set: (value: IFeatures): Promise<void> => chrome.storage.sync.set(value),
};

export const storage = {
  get: (): Promise<IStorage> =>
    chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
  set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};
