const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAdiRegistration = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const targetPath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets'
      );
      
      fs.mkdirSync(targetPath, { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, 'adi-registration.properties'),
        'CKO7AKQIWIACQAAAAAAAAAAAAA'
      );
      
      return config;
    },
  ]);
};

module.exports = withAdiRegistration;
