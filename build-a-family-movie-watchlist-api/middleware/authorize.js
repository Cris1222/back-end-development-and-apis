export function authorizeModification(req, res, next) {
  const user = req.user;
  const targetUserId = req.params.userId;

  if (
    user.role === 'parent' ||
    String(user.id) === String(targetUserId)
  ) {
    return next();
  }

  return res.status(403).json({
    error: 'Access denied'
  });
}