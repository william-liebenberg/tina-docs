import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'e7deb40ea3dac6e0f7cc84d14dc68fdebb1b444c', queries,  });
export default client;
  