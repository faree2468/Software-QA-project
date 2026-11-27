# Software QA Project - Practice Software Testing

This repository contains automated tests for [Practice Software Testing](https://practicesoftwaretesting.com), an open-source demo web shop:

- **E2E tests**: UI tests written with Playwright
- **API tests**: REST API tests written with Playwright (no browser needed)
- **Unit tests**: kept in a separate repository (see [Unit tests](#4-unit-tests))

## Requirements

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running)
- [Node.js](https://nodejs.org/) 18 or newer

## 1. Set up the application under test

The tests run against a local, forked copy of the website.

```bash
git clone https://github.com/faree2468/practice-software-testing.git
cd .\practice-software-testing\
docker compose up -d
docker compose exec -u root laravel-api chmod -R 777 storage bootstrap/cache
docker compose exec laravel-api php artisan migrate:fresh --seed
```

The `chmod` command lets the API write its cache and logs. You only need it once after a fresh clone.

When everything is running:

| Service | URL |
|---|---|
| Web shop | http://localhost:4200 |
| API | http://localhost:8091 |
| API docs (Swagger) | http://localhost:8091/api/documentation |

To reset the data at any time, run the `migrate:fresh --seed` command again.

## 2. Set up the test project

```bash
git clone https://github.com/faree2468/Software-QA-project.git
cd .\Software-QA-project\
```

### E2E tests

```bash
npm i
npx playwright install
```

### API tests

```bash
cd api
npm i
```

The API tests use Playwright's request API only, so you don't need to install browsers for them.

## 3. Run the tests

### E2E tests

```bash
npx playwright test
```

### API tests

```bash
cd api
npx playwright test
```

Before the E2E/API tests start, a setup project (`global.setup.ts`) clears the Laravel cache.

To test against a different API address, set `BASE_URL`:

```bash
# PowerShell
$env:BASE_URL="http://localhost:8091"; npx playwright test
```

Or create your own .env file and set BASE_URL like in .env.example

### Test reports

Both projects create an HTML report. To open it, run:

```bash
npx playwright show-report
```

### Known bugs

Some API tests are marked with `test.fail()` because they cover known bugs (for example, a guest can change product data). These tests count as **passed** while the bug exists. If the bug gets fixed, they start to fail, which tells you to remove the `test.fail()` mark. See the bug report for details.

## 4. Unit tests

The unit tests are kept in a separate repository on the `qa-testing` branch.

```bash
git clone -b qa-testing https://github.com/faree2468/web-project-food-delivery.git
cd .\web-project-food-delivery\
npm i
npm test
npm run coverage   # test coverage report
```

## Troubleshooting

| Problem | Fix |
|---|---|
| API returns 500 errors or "permission denied" in logs | Run the `chmod` command from step 1 again |
| Setup cannot find the container | Check the container name with `docker ps` and update it in `global.setup.ts` |
| Tests fail on data that should exist | Reset the database with `migrate:fresh --seed` |
| `the input device is not a TTY` | Remove `-it` from `docker exec` commands that run in scripts |