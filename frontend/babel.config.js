module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // É importante que o plugin do 'react-native-reanimated' seja a última linha!
      'react-native-reanimated/plugin',
    ],
  };
};
