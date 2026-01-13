import type { CollectionConfig } from 'payload';
import { adminOrModerator } from '../access';

export const Votes: CollectionConfig = {
  slug: 'votes',
  access: {
    read: adminOrModerator,
    create: () => true,
    update: adminOrModerator,
    delete: adminOrModerator
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true
    },
    {
      name: 'fingerprint',
      type: 'text',
      required: true,
      index: true
    },
    {
      name: 'ipHash',
      type: 'text',
      index: true
    }
  ],
  indexes: [
    {
      fields: ['post', 'fingerprint'],
      unique: true
    }
  ]
};
