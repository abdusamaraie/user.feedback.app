import type { CollectionConfig } from 'payload';
import { adminOnly } from '../access';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'moderator',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' }
      ]
    }
  ]
};
