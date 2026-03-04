import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheManagerService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async setListData<T>(key: string, data: T[]) {
        await this.cacheManager.set(key, data);
    }

    async setListDataWithExpiry<T>(key: string, data: T | T[], ttl: number) {
        await this.cacheManager.set(key, data, ttl);
    }

    async getListData<T>(key: string): Promise<T[]> {
        return JSON.parse(await this.cacheManager.get(key) || "") as T[];
    }

}
