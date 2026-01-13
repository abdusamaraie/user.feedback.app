import type { CollectionConfig } from 'payload';
import { adminOrModerator } from '../access';

export const Apps: CollectionConfig = {
  slug: 'apps',
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
    { name: 'description', type: 'textarea' },
    { name: 'appStoreUrl', type: 'text' },
    { name: 'playStoreUrl', type: 'text' }
  ]
};
