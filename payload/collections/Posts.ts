import type { CollectionConfig } from 'payload';
import { isModerator } from '../access/roles';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title'
  },
  access: {
    read: () => true,
    create: isModerator,
    update: isModerator,
    delete: isModerator
  },
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
      options: [
        { label: 'Feature', value: 'feature' },
        { label: 'Bug', value: 'bug' },
        { label: 'Idea', value: 'idea' }
      ],
      defaultValue: 'feature'
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Planned', value: 'planned' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Done', value: 'done' },
        { label: 'Closed', value: 'closed' }
      ],
      defaultValue: 'open'
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
    {
      name: 'authorName',
      type: 'text'
    },
    {
      name: 'authorEmail',
      type: 'text'
    },
    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: true
    },
    {
      name: 'deleteTokenHash',
      type: 'text',
      required: true
    }
  ]
};
