import type { Access, User } from 'payload';

type RoleUser = User & { roles?: Array<'admin' | 'moderator'> };

const hasRole = (user: RoleUser | null | undefined, role: 'admin' | 'moderator') =>
  Boolean(user?.roles?.includes(role));

export const isAdmin: Access = ({ req }) => hasRole(req.user as RoleUser, 'admin');

export const isModerator: Access = ({ req }) =>
  hasRole(req.user as RoleUser, 'admin') || hasRole(req.user as RoleUser, 'moderator');

export const isAdminOrSelf: Access = ({ req, id }) => {
  const user = req.user as RoleUser | undefined;
  if (!user) return false;
  if (hasRole(user, 'admin')) return true;
  return user.id === id;
};
