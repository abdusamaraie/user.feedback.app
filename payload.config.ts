import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Users } from './payload/collections/Users';
import { Apps } from './payload/collections/Apps';
import { Boards } from './payload/collections/Boards';
import { Tags } from './payload/collections/Tags';
import { Posts } from './payload/collections/Posts';
import { Votes } from './payload/collections/Votes';
import { seed } from './payload/seed/seed';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug
  },
  collections: [Users, Apps, Boards, Tags, Posts, Votes],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL
    }
  }),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  routes: {
    api: '/api/payload'
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  seed
});
