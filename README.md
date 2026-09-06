# is-minimax-good-at-coding-yet

## RUN THOSE TOKENS

I've been subscribed to MiniMax for a long time and was grandfathered into the weekly unlimited plan. When the pricing changed, I was told existing users who kept their Monthly Plus Token plans would be unaffected. I kept mine. I'm getting weekly limits anyway.

Apparently my grandfathered plan has a curfew. Fine. The question mark is getting a design department.

This is my extremely normal response: give M3 a black page, ask it to make the page prettier, and keep asking. Every working attempt gets committed and published. There's a time machine so you can inspect what my subscription did to the margins. We're targeting a new turn every 15 minutes, because apparently I need a deployment schedule for my feelings.

I paid for these tokens, so while I still have this 💩 plan, this question mark is going to have the most thoroughly considered heckin' margins on the internet.

## The experiment

MiniMax M3 keeps redesigning a page that begins black, with the title **is Minimax M3 good at frontend yet?** A permanent React + TanStack Router viewer lets anyone scrub backward through the actual interactive pages.

- Website: [live!](https://is-minimax-good-at-coding-yet.vercel.app/)
- Source and assets: https://github.com/funsaized/is-minimax-good-at-coding-yet
- Fixed prompt: [runner/prompt.md](runner/prompt.md)
- Technical walkthrough: [How the system works](docs/HOW_IT_WORKS.md), including the runner, sandboxes, commits, publication, and recovery.

## Local use

```sh
npm ci
npm run dev
```

`experiment/` contains the current generated page. `public/iterations/` contains every accepted build, desktop/mobile screenshots, and provenance. `public/manifest.json` drives the timeline. Everything in the archive is committed to GitHub and served by the current Vercel deployment. No database, object-storage account, or GitHub Actions is required.

## Run the experiment

The runner requires Linux, Bubblewrap (`bwrap`), Chromium (or Playwright's installed Chromium), Node, Git, GitHub CLI, and OpenCode. It uses your existing `gh`, Vercel CLI, and `minimax-coding-plan` OpenCode logins. No credentials belong in this repository. The Node dependencies and Vercel CLI are pinned by `package-lock.json`.

```sh
npm run status           # Published version, pending work, usage, errors
npm run iterate          # One real MiniMax turn, validate, commit, push, deploy
npm run service:start    # Start the local background systemd user service
npm run service:status
npm run pause            # Finish an active turn, then stop starting new turns
npm run resume
npm run service:stop     # Stop immediately; publication checkpoints survive
```

Follow logs with:

```sh
journalctl --user -u is-minimax-good-at-coding-yet -f
```

The transient service survives closing the terminal. Start it again after a reboot. A sleeping or powered-off machine cannot generate iterations; the deployed site stays available. Only one worker can run at once. `npm run iterate` refuses while the service holds the lock; stop the service first for a manual turn.

The target is one iteration start every **15 minutes**, with at most 96 model runs per UTC day, an 18-minute turn timeout, and automatic pause after five consecutive failures. Generation, validation, and publishing count toward those 15 minutes. If a turn takes longer, the next one starts after it finishes; runs never overlap. Publication timing follows the model's actual speed. Change [runner/config.json](runner/config.json) to adjust these. After a configuration/code change, commit it and restart the service. The $10 daily allowance uses costs reported by OpenCode and is checked between turns; subscription providers may report zero, so this is not a hard billing cap. Wall-time and run-count limits still apply.

## Publication and recovery

Each fresh OpenCode session receives the exact same prompt and the previous published source with a short history. The model can change only the experiment. Bubblewrap gives it a temporary writable workspace, read-only dependencies/build configuration, and only its MiniMax provider credential. It cannot access the host's GitHub/Vercel credentials, source archive, or viewer. Browser checks run before acceptance. The iframe runs with `sandbox="allow-scripts"`; snapshot assets permit its opaque origin and prohibit external network dependencies via CSP.

After a valid turn the runner commits source, saves the immutable build and screenshots, commits the archive, and pushes to GitHub. It creates a Vercel deployment without moving the live alias, checks the public viewer and iframe, then promotes it. Until promotion, visitors keep the previous working site. Publication state lives in ignored `.runner/state.json`; a deployment failure retries the same archived version. Attempts and private model logs are kept in `.runner/attempts/`.

There is no aesthetic approval gate: every technically valid changed attempt is published. The title, build, runtime, self-contained assets, mobile overflow, and snapshot sizes are checked. These checks do not guarantee visual quality or full accessibility. Invalid attempts leave the published page intact and back off before trying again.

If the model omits `CHANGELOG.md` (for example, when its output is truncated), the runner generates a labeled changelog listing actual added, modified, and deleted page files. Missing metadata alone does not reject a page; all build, browser, and page-change checks still apply.

`npm run publish` resumes a pending publication without generating a new page. Stop the service before using it. Do not edit the repository while a publication is pending. If a run is paused, inspect `npm run status` and the local logs, resolve the issue, then resume. A killed model attempt is abandoned; the next turn starts from the last accepted source.

Snapshots deliberately live in Git. The worker pauses before the archive exceeds 10 GB or a snapshot exceeds 12 MB. The larger archive allowance supports a multi-week run; move historical snapshots to dedicated storage before increasing it further. Historical versions are never automatically deleted or rebuilt, and remote assets are disallowed so old versions remain self-contained.

## First-time provisioning

```sh
gh auth login
opencode auth login                 # Authenticate the MiniMax coding plan
npx vercel login
npx vercel link --yes --project is-minimax-good-at-coding-yet
git init -b main
gh repo create is-minimax-good-at-coding-yet --public --source . --remote origin
git add .
git commit -m "Build the experiment"
npm run seed
npm run publish
npm run service:start
```

The publisher needs public access to the new project's deployment URLs for smoke checks; disable deployment authentication for this public experiment. Git auto-deployment is disabled to avoid duplicating the worker's checked deployments. Builds use Vercel's prebuilt output API, so the server only serves static files.

## Checks

```sh
npm test
npm run build
npm run test:browser
```

Browser tests create private temporary timeline fixtures and never publish fabricated MiniMax iterations. The browser tests require the seed to have been archived first. `npm run seed` archives the initial black page exactly once.
