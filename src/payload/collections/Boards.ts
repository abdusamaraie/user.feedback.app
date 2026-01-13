import type { CollectionConfig } from 'payload';
import { adminOrModerator } from '../access';

export const Boards: CollectionConfig = {
  slug: 'boards',
  admin: {
    useAsTitle: 'name'
  },
  access: {
    read: () => true,
    create: adminOrModerator,
    update: adminOrModerator,
    delete: adminOrModerator
  },
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
  ],
  indexes: [
    {
      fields: ['app', 'slug'],
      unique: true
    }
  ]
};
