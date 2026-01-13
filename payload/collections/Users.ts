import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrSelf } from '../access/roles';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['moderator'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' }
      ]
    }
  ]
};
