import dotenv from "dotenv";
import findConfig from "find-config";

dotenv.config({
  path: findConfig(".env"),
});

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? findConfig(".env.production")
      : findConfig(".env.development"),
});
