# 📦 CargoLoggerApp

[![React Native](https://img.shields.io/badge/React%20Native-0.72.4-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful React Native application for logging cargo information with automatic metadata embedding into photos. Perfect for logistics, shipping, warehousing, and inventory management.

## 🌟 Key Features

- **📷 Smart Photo Capture** - Take photos or select from gallery with automatic optimization
- **📍 GPS Integration** - Automatic location capture and embedding
- **📝 Comprehensive Logging** - Record cargo ID, description, dimensions, and weight
- **🏷️ EXIF Metadata Embedding** - Seamlessly embed cargo data directly into photo metadata
- **💾 Local Storage** - Save photos with embedded metadata for offline access
- **🔒 Data Integrity** - Tamper-proof metadata storage using industry-standard EXIF format
- **📱 Cross-Platform** - Works on both iOS and Android devices

## 🎯 Use Cases

- **Logistics & Shipping** - Document cargo at various checkpoints
- **Warehouse Management** - Track inventory with visual documentation
- **Quality Control** - Associate inspection data with visual evidence
- **Supply Chain** - Maintain cargo history throughout transportation
- **Insurance Documentation** - Create verifiable cargo condition records

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.72.4 | Cross-platform mobile framework |
| TypeScript | 4.9.5 | Type-safe development |
| React Native Camera | Latest | Photo capture functionality |
| Geolocation Services | Latest | GPS coordinate tracking |
| EXIF.js | Latest | Metadata embedding |
| React Native FS | Latest | File system operations |

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **React Native CLI** - Install with `npm install -g react-native-cli`
- **Android Studio** (for Android development) - [Setup Guide](https://reactnative.dev/docs/environment-setup)
- **Xcode** (for iOS development, macOS only) - [App Store](https://apps.apple.com/app/xcode/id497799835)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/schaeleursli/CargoLoggerApp.git
   cd CargoLoggerApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   npx react-native run-ios
   ```

## 📱 How to Use

### Basic Workflow

1. **📸 Capture Photo**
   - Tap "Camera" to take a new photo
   - Or tap "Gallery" to select an existing image

2. **📍 Get Location**
   - Tap "Get GPS" to capture current coordinates
   - Location is automatically embedded in metadata

3. **📝 Enter Cargo Details**
   - **Cargo ID**: Unique identifier (required)
   - **Description**: Detailed cargo description (required)
   - **Dimensions**: Length, width, height (optional)
   - **Weight**: Cargo weight (optional)

4. **💾 Save with Metadata**
   - Tap "Embed & Save" to create the final image
   - All data is embedded into the photo's EXIF metadata
   - Image is saved to device storage

### Metadata Structure

The app embeds data into standard EXIF fields:

```javascript
{
  ImageDescription: "Cargo description",
  Make: "CargoID:YOUR_ID", 
  UserComment: "L:length W:width H:height WT:weight",
  GPS: {
    Latitude: "Decimal degrees",
    Longitude: "Decimal degrees"
  }
}
```

## 🔧 Development

### Project Structure

```
CargoLoggerApp/
├── App.tsx                 # Main application component
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

### Available Scripts

```bash
# Run on Android device/emulator
npm run android

# Run on iOS device/simulator  
npm run ios

# Start Metro bundler
npx react-native start

# Reset Metro cache
npx react-native start --reset-cache
```

### Key Dependencies

- **react-native-image-picker** - Camera and gallery access
- **react-native-geolocation-service** - GPS location services
- **react-native-fs** - File system operations
- **react-native-webview** - EXIF metadata processing
- **react-native-permissions** - Runtime permissions handling

## 🔐 Permissions

The app requires the following permissions:

### Android
- `ACCESS_FINE_LOCATION` - GPS coordinates
- `CAMERA` - Photo capture
- `READ_EXTERNAL_STORAGE` - Gallery access
- `WRITE_EXTERNAL_STORAGE` - Save photos

### iOS
- `NSLocationWhenInUseUsageDescription` - GPS access
- `NSCameraUsageDescription` - Camera access
- `NSPhotoLibraryUsageDescription` - Photo library access

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Add proper error handling
- Include comments for complex logic
- Test on both iOS and Android
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**Android build failures:**
```bash
cd android && ./gradlew clean && cd ..
```

**iOS build issues:**
```bash
cd ios && rm -rf build && pod install && cd ..
```

**Permission denied errors:**
- Ensure all required permissions are granted in device settings
- Check that location services are enabled

## 🗺️ Roadmap

### Upcoming Features

- [ ] **QR Code Integration** - Scan QR codes for quick cargo ID entry
- [ ] **Cloud Backup** - Sync data to AWS S3/Google Drive
- [ ] **Bulk Operations** - Process multiple cargo items
- [ ] **Search & Filter** - Find logged cargo quickly
- [ ] **Export Functionality** - Export data to CSV/JSON
- [ ] **Barcode Scanner** - Support for various barcode formats
- [ ] **Offline Sync** - Queue operations when offline
- [ ] **Team Collaboration** - Share cargo logs with team members

### Version History

- **v1.0.0** - Initial release with core functionality
  - Photo capture and gallery selection
  - GPS location embedding
  - EXIF metadata integration
  - Local file storage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 schaeleursli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**schaeleursli**
- GitHub: [@schaeleursli](https://github.com/schaeleursli)

## 🙏 Acknowledgments

- React Native team for the amazing framework
- Open source community for the excellent libraries
- Contributors who help make this project better

---

<div align="center">

**⭐ Star this repository if you find it useful! ⭐**

[Report Bug](https://github.com/schaeleursli/CargoLoggerApp/issues) · [Request Feature](https://github.com/schaeleursli/CargoLoggerApp/issues) · [Contribute](https://github.com/schaeleursli/CargoLoggerApp/pulls)

</div>
