import type { Access, AccessArgs } from 'payload';

export const isAdmin = ({ req }: AccessArgs) => {
  return req.user?.role === 'admin';
};

export const isAdminOrModerator = ({ req }: AccessArgs) => {
  return req.user?.role === 'admin' || req.user?.role === 'moderator';
};

export const adminOnly: Access = ({ req }) => {
  return req.user?.role === 'admin';
};

export const adminOrModerator: Access = ({ req }) => {
  return req.user?.role === 'admin' || req.user?.role === 'moderator';
};
