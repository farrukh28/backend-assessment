import { nodeCache } from "../utils/node-cache.js";

export const cacheUserByID = (req, res, next) => {
  const { ID } = req.params;

  const data = nodeCache.get(`user:${ID}`);

  if (data) {
    res.json({ data, fromCache: true });
  } else {
    next();
  }
};

export const cacheAllUsers = (req, res, next) => {
  let { page, limit, sort, q } = req.query;

  if (!page) page = 0;
  if (page) page--;
  if (!limit) limit = 10;

  if (!sort) sort = "";
  if (!q) q = "";

  const key = `get-all-users-page:${page}-limit:${limit}-sort${sort}-q:${q}`;

  const data = nodeCache.get(key);

  if (data) {
    res.json({ ...data, fromCache: true });
  } else {
    next();
  }
};

export const clearAllUsersCache = () => {
  const allKeys = nodeCache.keys();
  const clearKey = "get-all-users";
  allKeys.forEach((key) => {
    if (key.startsWith(clearKey)) {
      nodeCache.del(key);
    }
  });
};
