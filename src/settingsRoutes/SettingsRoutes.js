// settingsRoutes.js
const express = require('express');
const router = express.Router();

// In-memory store (replace with DB)
const userSettingsStore = {}; // { userId: settings }

function requireAuth(req, res, next) {
  // TODO: implement real auth (JWT/session)
  // For demo assume userId in header
  const userId = req.header('x-demo-userid') || 'demo-user';
  req.userId = userId;
  next();
}

router.use(requireAuth);

/**
 * GET /api/settings
 * returns settings for authenticated user
 */
router.get('/settings', (req, res) => {
  const s = userSettingsStore[req.userId] || null;
  if (!s) return res.json({ .../*client default can be applied client-side*/ });
  res.json(s);
});

/**
 * POST /api/settings
 * save or replace settings for user
 */
router.post('/settings', express.json(), (req, res) => {
  const payload = req.body;
  // validate basic shape, whitelist keys
  const allowed = [
    'displayName','showOnlineStatus','showAge','locationSharing',
    'defaultCamera','defaultMicMuted','videoQuality','defaultVibe','maxDistanceKm','preferredLanguage',
    'allowPrivateCallsFromFollowersOnly','autoAcceptPrivateCalls','allowRecording','showVibeBadge','blockedUsers',
    'notificationsEnabled','notifShowPreviews','dndEnabled','dndFrom','dndTo','twinPlusSubscribed','debugMode'
  ];
  const sanitized = {};
  allowed.forEach(k => { if (typeof payload[k] !== 'undefined') sanitized[k] = payload[k]; });

  userSettingsStore[req.userId] = { ...(userSettingsStore[req.userId] || {}), ...sanitized, updatedAt: new Date() };
  res.json({ ok: true, settings: userSettingsStore[req.userId] });
});

/**
 * DELETE /api/account
 * delete account - demo only
 */
router.delete('/account', (req, res) => {
  delete userSettingsStore[req.userId];
  // TODO: also remove user, sessions, content, files, subscriptions
  res.json({ ok: true });
});

module.exports = router;