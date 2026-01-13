import type { CollectionConfig } from 'payload';
import { isModerator } from '../access/roles';

export const Votes: CollectionConfig = {
  slug: 'votes',
  admin: {
    useAsTitle: 'fingerprint'
  },
  access: {
    read: isModerator,
    create: isModerator,
    update: isModerator,
    delete: isModerator
  },
  indexes: [
    {
      fields: ['post', 'fingerprint'],
      unique: true
    },
    {
      fields: ['fingerprint']
    },
    {
      fields: ['post']
    }
  ],
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
  ]
};
