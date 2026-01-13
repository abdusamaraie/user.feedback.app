import path from 'path';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { Apps } from './payload/collections/Apps';
import { Boards } from './payload/collections/Boards';
import { Tags } from './payload/collections/Tags';
import { Posts } from './payload/collections/Posts';
import { Votes } from './payload/collections/Votes';
import { Users } from './payload/collections/Users';
import { seed } from './payload/seed';

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: 'Feedback Board'
    }
  },
  collections: [Users, Apps, Boards, Tags, Posts, Votes],
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL
    }
  }),
  typescript: {
    outputFile: path.resolve('src/payload-types.ts')
  },
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED === 'true') {
      await seed(payload);
    }
  }
});
