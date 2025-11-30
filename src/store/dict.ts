import type { DictDataResult } from '@/types/dict';
import type { DictOptionsParams } from '@/utils/dict';
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { generateDictCacheKey } from '@/utils/dict';

const $t = (key: string) => key; // Mock $t

export interface DictOption {
  disabled?: boolean;
  label: string;
  value: boolean | number | string;
  color?: string;
}

export function dictToOptions(
  data: DictDataResult[],
  params: DictOptionsParams,
): DictOption[] {
  const { asBoolean = false, asNumber = false, asString = false } = params;

  return data.map((item) => {
    let value: boolean | number | string = item.value;
    if (asBoolean) {
      value = item.value === 'true';
    } else if (asNumber) {
      value = Number(item.value);
    } else if (asString) {
      value = item.value;
    }

    return {
      disabled: item.status === 0,
      label: $t(item.label),
      value,
      color: item.color,
    };
  });
}

export const useDictStore = defineStore('dict', () => {
  const dictOptionsMap = reactive(new Map<string, DictOption[]>());
  const dictRequestCache = reactive(
    new Map<string, Promise<DictDataResult[]>>(),
  );

  function getDictOptions(
    dictName: string,
    params: DictOptionsParams,
  ): DictOption[] {
    if (!dictName) return [];

    const cacheKey = generateDictCacheKey(dictName, params);

    if (!dictOptionsMap.has(cacheKey)) {
      dictOptionsMap.set(cacheKey, []);
    }

    return dictOptionsMap.get(cacheKey) || [];
  }

  function setDictInfo(
    dictName: string,
    dictValue: DictDataResult[],
    params: DictOptionsParams,
  ) {
    const cacheKey = generateDictCacheKey(dictName, params);

    if (
      dictOptionsMap.has(cacheKey) &&
      dictOptionsMap.get(cacheKey)?.length === 0
    ) {
      dictOptionsMap.get(cacheKey)?.push(...dictToOptions(dictValue, params));
    } else {
      dictOptionsMap.set(cacheKey, dictToOptions(dictValue, params));
    }
  }

  function resetCache() {
    dictOptionsMap.clear();
    dictRequestCache.clear();
  }

  function $reset() {
    // doNothing
  }

  return {
    $reset,
    dictOptionsMap,
    dictRequestCache,
    getDictOptions,
    setDictInfo,
    resetCache,
  };
});
