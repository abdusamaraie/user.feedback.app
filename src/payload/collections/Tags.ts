import type { CollectionConfig } from 'payload';
import { adminOrModerator } from '../access';

export const Tags: CollectionConfig = {
  slug: 'tags',
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
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'color', type: 'text' }
  ]
};
