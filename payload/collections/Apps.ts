import type { CollectionConfig } from 'payload';
import { isModerator } from '../access/roles';

export const Apps: CollectionConfig = {
  slug: 'apps',
  admin: {
    useAsTitle: 'name'
  },
  access: {
    read: () => true,
    create: isModerator,
    update: isModerator,
    delete: isModerator
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'appStoreUrl', type: 'text' },
    { name: 'playStoreUrl', type: 'text' }
  ]
};
