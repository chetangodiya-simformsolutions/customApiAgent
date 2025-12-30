module.exports = {
  assets: ['./app/assets/fonts/'],
  project: {
    ios: {
      automaticPodsInstallation: true
    },
    android: {}
  },
  dependencies: {
    'react-native-config': { platforms: { android: null } },
  }
};
