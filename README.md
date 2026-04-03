# Jelly Blocks 3D

A beautiful, glassmorphism, 3D Tetris-inspired game built with React, Three.js, and Tailwind CSS. Instead of solid blocks, you play with realistic, wobbly jelly blocks!

## Features

- **Realistic Jelly Physics:** Custom GLSL shaders (Vertex and Fragment) simulate organic wobble, subsurface scattering, specular highlights, and fake refraction using MatCaps.
- **3D Gameplay:** Built on top of `@react-three/fiber` and `@react-three/drei` for a fully 3D rendered board.
- **Glassmorphism UI:** A modern, clean, and beautiful user interface using Tailwind CSS.
- **Mobile Optimized:** Touch controls and optimized shader logic ensure smooth performance on mobile devices.
- **Classic Mechanics:** Full Tetris mechanics including line clears, scoring, levels, and increasing drop speeds.

## Tech Stack

- **Framework:** React 19 + Vite
- **3D Rendering:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React

## Running Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## Deploying to GitHub Pages

This project is pre-configured to be deployed to GitHub Pages. The `base: './'` property in `vite.config.ts` ensures that assets are linked correctly regardless of your repository name.

### Option 1: Using GitHub Actions (Recommended)

1. Push your code to a GitHub repository.
2. Go to your repository **Settings** > **Pages**.
3. Under **Build and deployment**, change the **Source** to **GitHub Actions**.
4. GitHub will suggest a "Static HTML" or "Vite" workflow. You can use the following `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Option 2: Using the `gh-pages` npm package

1. Install the `gh-pages` package:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Add the following scripts to your `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run the deploy command:
   ```bash
   npm run deploy
   ```
4. Go to your repository **Settings** > **Pages** and ensure the source branch is set to `gh-pages`.

## Controls

- **Desktop:**
  - `Arrow Left` / `Arrow Right`: Move piece
  - `Arrow Down`: Soft drop
  - `Arrow Up`: Rotate piece
  - `Space`: Hard drop
- **Mobile:**
  - Use the on-screen glassmorphism buttons.

## License

MIT
