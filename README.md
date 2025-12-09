# QR Code Generator

A modern, feature-rich QR code generator built with React, TypeScript, and Tailwind CSS 4. Generate customizable QR codes with logos, custom colors, and various quality levels.

## Features

- **Multiple Input Types**: Generate QR codes from URLs, text, email, phone numbers, WiFi credentials, and more
- **Quick Presets**: One-click templates for common QR code types
- **Customizable Appearance**:
  - Adjustable size (128px - 512px)
  - Custom foreground and background colors
  - Optional margin control
- **Logo Support**: Add your own logo/image to the center of the QR code
  - Adjustable logo size
  - Opacity control
- **Error Correction Levels**: Choose from L, M, Q, or H levels for different damage tolerance
- **Download**: Export QR codes as PNG images
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Preview**: See changes instantly as you customize

## Tech Stack

- **React 19** - Latest version with modern hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first CSS (no config file needed!)
- **Vite** - Fast build tool and dev server
- **qrcode.react** - QR code generation library
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Basic Usage

1. Enter your content (URL, text, etc.) in the main text area
2. Adjust the size and error correction level as needed
3. Preview the QR code in real-time
4. Click "Download QR Code" to save as PNG

### Advanced Customization

1. Click "Advanced Customization" to expand options
2. Choose custom foreground and background colors
3. Toggle margin on/off
4. Upload a logo to place in the center
5. Adjust logo size and opacity

### Quick Presets

Use the preset buttons for common QR code types:
- **Website**: Standard URL format
- **Email**: mailto: link format
- **Phone**: tel: link format
- **WiFi**: WiFi connection string format

## Error Correction Levels

- **L (Low)**: ~7% damage tolerance
- **M (Medium)**: ~15% damage tolerance (default)
- **Q (Quartile)**: ~25% damage tolerance
- **H (High)**: ~30% damage tolerance (recommended when using logos)

Higher error correction allows the QR code to be scanned even if partially damaged or obscured (like when adding a logo).

## Project Structure

```
qr-generator/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Tailwind CSS imports
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Tailwind CSS 4 Notes

This project uses Tailwind CSS 4, which introduces several improvements:

- No separate `tailwind.config.js` file needed
- Uses `@import "tailwindcss"` in CSS
- Configured via Vite's PostCSS integration
- Faster builds and smaller bundle sizes

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Tips for Best Results

1. Use high error correction (Q or H) when adding logos
2. Ensure good contrast between foreground and background colors
3. Test your QR codes with multiple scanning apps before production use
4. Larger sizes (384px+) provide better scan reliability
5. Keep logos relatively small (50px or less) for best scanning results

## Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)
