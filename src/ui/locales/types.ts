import type { GetContentBetweenTwoChar } from '@mimi-utils/types';

import type { rootAppLocale } from '.';
import type templateContentLocale from './modules/template-content';

/**
 * @see https://blog.csdn.net/shenenhua/article/details/79150053
 */
export type LocaleTypes = 'zh-CN' | 'en-US';

export type AppLocaleId = keyof typeof rootAppLocale;

export type TemplateLanguageKey = keyof typeof templateContentLocale;

export type TemplateTypeMapping = {
  [K in TemplateLanguageKey]: Record<GetContentBetweenTwoChar<K, '{', '}'>, any>;
};
