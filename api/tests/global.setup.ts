import {test as setup} from '@playwright/test';
import { execSync } from 'node:child_process';

function findContainer(): string | undefined {
    const out = execSync('docker ps --filter "name=laravel-api" --format "{{.Names}}"').toString().trim().split('\n')[0];
    return out || undefined;
}

setup('clear db cache and config', async ({ }) => {
    try {
        const container = findContainer();
        if (!container) return console.warn('skipping cache clear');
        execSync(`docker exec -u root ${container} php artisan cache:clear`, { stdio: 'inherit' });
        execSync(`docker exec -u root ${container} php artisan config:clear`, { stdio: 'inherit' });
    } catch (e) {
        console.warn('Cache clear skipped: ', (e as Error).message)
    }
})