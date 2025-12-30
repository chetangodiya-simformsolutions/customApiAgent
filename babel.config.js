module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ...(process.env.BABEL_ENV !== 'development' ? [['transform-remove-console']] : []),
  ]
};
