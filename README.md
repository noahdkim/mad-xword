# Deploy React App to GitHub Pages

Quick reference for deploying a React app to GitHub Pages.

## Setup (one-time)

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/your-repo-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

3. Make sure images are in the `public` folder

## Deploy

```bash
npm run deploy
```

## GitHub Settings

1. Go to repo Settings → Pages
2. Set Source to `gh-pages` branch
3. Save

Your app will be live at `https://yourusername.github.io/your-repo-name`

## Redeploy

Just run `npm run deploy` again whenever you make changes!
