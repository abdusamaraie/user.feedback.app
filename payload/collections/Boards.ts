import type { CollectionConfig } from 'payload';
import { isModerator } from '../access/roles';

export const Boards: CollectionConfig = {
  slug: 'boards',
  admin: {
    useAsTitle: 'name'
  },
  access: {
    read: () => true,
    create: isModerator,
    update: isModerator,
    delete: isModerator
  },
  indexes: [
    {
      fields: ['app', 'slug'],
      unique: true
    }
  ],
  fields: [
    {
      name: 'app',
      type: 'relationship',
      relationTo: 'apps',
      required: true
    },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'isPublic', type: 'checkbox', defaultValue: true },
    { name: 'description', type: 'textarea' }
  ]
};
