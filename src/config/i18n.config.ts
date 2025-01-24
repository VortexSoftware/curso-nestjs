import { HeaderResolver, I18nModule, I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

const I18nModuleConfig = () => {
  const options: I18nOptions = {
    fallbackLanguage: 'es',
    loaderOptions: {
      path: path.join(__dirname, '../../../src/i18n'),
      watch: true,
    },
    resolvers: [{ use: HeaderResolver, options: ['lang'] }],
  };

  return I18nModule.forRoot(options);
};

export default I18nModuleConfig;
