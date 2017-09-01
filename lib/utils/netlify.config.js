import { join } from "path";

const setConfigPaths = function(configObject, enforcedPath) {
  const newConfig = {
    collections: []
  };

  if (configObject.media_folder) {
    newConfig.media_folder = join(enforcedPath, configObject.media_folder);
  }

  if (configObject.collections) {
    configObject.collections.forEach(function(collection) {
      collection.folder &&
        newConfig.collections.push({
          ...collection,
          folder: join(enforcedPath, collection.folder)
        });
    });
  }

  return {
    ...configObject,
    ...newConfig
  };
};

export { setConfigPaths };
