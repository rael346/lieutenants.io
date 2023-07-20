import { envsafe, port, str } from "envsafe";
import "dotenv/config";

export const env = envsafe({
  PORT: port({
    input: process.env.PORT,
    default: 4000,
  }),
  HOST: str({
    input: process.env.HOST,
    default: "::",
  }),
});
