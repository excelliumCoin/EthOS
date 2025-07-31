# EthOS Pac-Man Labyrinth

A unique Pac-Man game where the maze is designed to resemble the "EthOS" text. Navigate through the labyrinth, collect pellets, and avoid the colorful ghosts in this modern take on the classic arcade game.

## 🎮 Game Features

- **EthOS-Themed Maze**: The maze layout forms the letters "E", "T", "H", "O", "S"
- **Classic Gameplay**: Control Pac-Man with arrow keys to collect all pellets
- **Colorful Ghosts**: Three AI-controlled ghosts with different colors and movement patterns
- **Score System**: Earn 10 points for each pellet collected
- **Win/Lose Conditions**: Collect all pellets to win, avoid ghosts to survive
- **Restart Functionality**: Press SPACE to restart after game over or winning

## 🕹️ How to Play

1. Use **Arrow Keys** to move Pac-Man through the maze
2. Collect all **yellow pellets** to win the game
3. Avoid the **colored ghosts** (red, blue, green) - touching them ends the game
4. Press **SPACE** to restart after game over or winning

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm, yarn, pnpm, or bun package manager

### Installation & Running Locally

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ethos-pacman-game
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:8000](http://localhost:8000) in your browser to play the game.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## 🌐 Deploy on Vercel

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import your project on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect it's a Next.js project and configure the build settings
4. Your game will be live at your Vercel URL!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ethos-pacman-game)

## 🛠️ Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5 Canvas** - For game rendering and animations
- **React Hooks** - For state management and game logic

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page component
├── components/
│   └── PacManGame.tsx   # Main game component with canvas logic
└── lib/
    └── mazeData.ts      # Maze layout data and game constants
```

## 🎯 Game Logic

- **Maze Design**: 2D array representing walls (1) and paths (0)
- **Collision Detection**: Prevents movement through walls and detects ghost/pellet interactions
- **AI Movement**: Ghosts use random direction changes when hitting walls
- **Game Loop**: Uses `requestAnimationFrame` for smooth 60fps gameplay
- **State Management**: React hooks manage game state, score, and win/lose conditions

## 🔧 Customization

You can easily customize the game by modifying:

- **Maze Layout**: Edit `MAZE_LAYOUT` in `src/lib/mazeData.ts`
- **Game Speed**: Adjust `GAME_SPEED` and `GHOST_SPEED` constants
- **Colors**: Change ghost colors and UI colors in the component
- **Cell Size**: Modify `CELL_SIZE` for different maze scales

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

---

Built with ❤️ using Next.js and TypeScript. Ready for deployment on Vercel!
