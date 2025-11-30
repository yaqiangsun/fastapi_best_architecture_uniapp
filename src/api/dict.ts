import { requestClient } from './request';
import type { DictDataResult } from '@/types/dict';

export async function getDictDataDetailApi(dictName: string) {
    // Adjust API path as needed
    return requestClient.get<DictDataResult[]>(`/api/v1/system/dict/data/type/${dictName}`);
}
