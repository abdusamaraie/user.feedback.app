import type { CollectionConfig } from 'payload';
import { adminOrModerator } from '../access';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title'
  },
  access: {
    read: () => true,
    create: () => true,
    update: adminOrModerator,
    delete: adminOrModerator
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      required: true
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120
    },
    {
      name: 'body',
      type: 'textarea',
      required: true
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'feature',
      options: [
        { label: 'Feature', value: 'feature' },
        { label: 'Bug', value: 'bug' },
        { label: 'Idea', value: 'idea' }
      ]
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Planned', value: 'planned' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Done', value: 'done' },
        { label: 'Closed', value: 'closed' }
      ]
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true
    },
    {
      name: 'pinned',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'votesCount',
      type: 'number',
      defaultValue: 0,
      index: true
    },
    { name: 'authorName', type: 'text' },
    { name: 'authorEmail', type: 'text' },
    { name: 'isAnonymous', type: 'checkbox', defaultValue: true },
    {
      name: 'deleteTokenHash',
      type: 'text',
      required: true
    }
  ]
};
