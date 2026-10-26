const {
  AndroidConfig,
  withAndroidColors,
  withAndroidColorsNight,
} = require('expo/config-plugins');

// Native dialogs, pickers and switches read colorPrimary from the Android
// theme. Match the app's Material 3 primary from src/unistyles.ts.
const LIGHT_PRIMARY = '#0061A4';
const DARK_PRIMARY = '#9ECAFF';

const setPrimary = (colors, value) =>
  AndroidConfig.Colors.assignColorValue(colors, {
    name: 'colorPrimary',
    value,
  });

module.exports = config => {
  config = withAndroidColors(config, mod => {
    mod.modResults = setPrimary(mod.modResults, LIGHT_PRIMARY);
    return mod;
  });
  return withAndroidColorsNight(config, mod => {
    mod.modResults = setPrimary(mod.modResults, DARK_PRIMARY);
    return mod;
  });
};
