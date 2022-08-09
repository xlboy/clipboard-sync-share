import { createIntl } from '@formatjs/intl';
import { useAppStore } from '@ui/stores/app';
import type { IntlShape, MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import 'intl-messageformat';
import '@formatjs/intl-listformat';

import templateContentLocale from './modules/template-content';
import type { LocaleTypes } from './types';

export const rootAppLocale = {
  ...templateContentLocale
} as const;

import type { AppLocaleId, TemplateLanguageKey, TemplateTypeMapping } from './types';

export function getAppLocale(type: LocaleTypes): Record<string, string> {
  const localeIndexMap: Record<LocaleTypes, number> = {
    'zh-CN': 0,
    'en-US': 1
  };

  return Object.entries(rootAppLocale).reduce((previousValue, item) => {
    const [k, v] = item;
    const localeVal = v[localeIndexMap[type]];

    const filterKeyVars = k
      .match(/(?<=^\${).+(?=})/)?.[0]
      .split('|')
      .reduce((preVal, _k) => ({ ...preVal, [_k]: localeVal }), {});

    return {
      ...previousValue,
      [k]: localeVal,
      ...filterKeyVars
    };
  }, {});
}

type FormatMessageProps = (
  descriptor: MessageDescriptor,
  options?: Record<string, string>
) => string;

/**
 * @description 国际化插件的类型加工，完善ts提示
 */
const intlTypeProcess = (intl: IntlShape) => {
  const { formatMessage: _formatMessage, ...rest } = intl;
  const formatMessage: FormatMessageProps = _formatMessage;

  return {
    ...rest,
    formatMessage,
    f: <T extends AppLocaleId>(
      id: T,
      ...args: T extends TemplateLanguageKey
        ? [options: TemplateTypeMapping[T]]
        : [options?: Record<string, any>]
    ) => formatMessage({ id: id as any }, args[0])
  };
};

export const useAppIntl = (): ReturnType<typeof intlTypeProcess> => {
  const intl = useIntl();

  return intlTypeProcess(intl);
};

export function getAppIntl(): ReturnType<typeof intlTypeProcess> {
  const { currentLocale } = useAppStore.getState();
  const intl = createIntl({
    locale: currentLocale,
    messages: getAppLocale(currentLocale)
  });

  return intlTypeProcess(intl as IntlShape);
}
