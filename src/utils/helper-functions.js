import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * @description gets the __dirname property
 * @param {string} path path of directory
 * @returns {sting} path resolved to the CWD (current working directory)
 */
export const getDirNameGlobal = (path) => {
  const __dirname = dirname(fileURLToPath(path));
  return __dirname;
};

/**
 * @description transform the sort string
 * @param {string} sortBy string to parse e.g."name.asc,description" or "name.desc"
 * @returns
 */
export const transformSortByString = (sortBy) => {
  const obj = {};

  const stringParts = sortBy.split(",");

  stringParts.forEach((str) => {
    const key = str?.split(".")[0]?.trim();
    const value = str?.split(".")[1]?.trim();

    if (key && value) {
      obj[key] = value;
    }
  });

  return obj;
};
