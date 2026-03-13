# Birthday Love Website

A beautiful, professional birthday tribute website featuring:
- Spotify-inspired music player UI
- Love songs playlist
- Image gallery with your memories
- Responsive design
- Smooth animations and blurred modals

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Features

✨ **Spotify-Inspired Design**
- Professional dark gradient theme
- Smooth modal transitions
- Progressive blur effects
- Album artwork with blur backdrop

🎵 **Music Playlist**
- 8 carefully curated love songs
- Song details and descriptions
- Interactive music player controls
- Next/Previous navigation

📸 **Image Gallery**
- Display 6 beautiful memories
- Hover animations
- Integration with your photos (finepic1.jpg through finepic6.jpg)

💬 **Love Message**
- Personalized birthday message
- Always visible at the top

## Project Structure

```
my-dopamine/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main birthday page
│   └── globals.css         # Global styles
├── components/
│   └── ui/
│       └── progressive-blur-modal.tsx  # Music player component
├── public/
│   ├── finepic1.jpg        # Your photo assets
│   ├── finepic2.jpg
│   └── ... (up to finepic6.jpg)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

## Customization

### Add More Love Songs
Edit the `loveSongs` array in `app/page.tsx`:

```typescript
const loveSongs: Song[] = [
  {
    title: "Song Title",
    artist: "Artist Name",
    duration: "3:45",
    spotifyId: "spotify_id",
    description: "Your beautiful description here"
  },
  // Add more songs...
];
```

### Update the Birthday Message
Modify the love message in the banner section of `app/page.tsx`

### Change Colors
Edit color scheme in:
- `tailwind.config.js` - Primary Spotify green (#1DB954)
- `app/globals.css` - Gradient backgrounds

### Update Images
Replace the image files in the `public/` folder with your own:
- Keep the same filenames (finepic1.jpg through finepic6.jpg)
- Recommended: High-quality JPG or PNG format

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Lucide icons
- **Package Manager**: npm

## License

Created with love ❤️
