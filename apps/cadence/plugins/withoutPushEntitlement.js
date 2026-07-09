const { withEntitlementsPlist } = require('expo/config-plugins');

// expo-widgets adds aps-environment to the main app's entitlements even with
// enablePushNotifications off (plugin bug, present through 57.0.3). This app
// has no push notifications, and the entitlement makes provisioning demand the
// Push Notifications capability. Strip it. Config-plugin mods execute in
// reverse plugin-array order, so this plugin must stay BEFORE expo-widgets in
// app.json for its delete to run after expo-widgets' set.
module.exports = config =>
  withEntitlementsPlist(config, mod => {
    delete mod.modResults['aps-environment'];
    return mod;
  });
