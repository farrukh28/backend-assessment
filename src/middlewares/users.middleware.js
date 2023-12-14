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
