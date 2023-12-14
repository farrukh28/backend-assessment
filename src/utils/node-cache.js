import NodeCache from "node-cache";

export const nodeCache = new NodeCache({
  stdTTL: 100,
  checkperiod: 120,
});
