import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';

interface CargoData {
  id: string;
  desc: string;
  length: string;
  width: string;
  height: string;
  weight: string;
}

interface GPSLocation {
  lat: number | null;
  lon: number | null;
}

export default function App() {
  const [cargo, setCargo] = useState<CargoData>({
    id: '',
    desc: '',
    length: '',
    width: '',
    height: '',
    weight: '',
  });
  const [gps, setGps] = useState<GPSLocation>({ lat: null, lon: null });
  const [base64Image, setBase64Image] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');
  const [embedHtml, setEmbedHtml] = useState<string>('');

  const requestLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }
    Geolocation.getCurrentPosition(
      pos => setGps({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => console.warn('GPS error', err),
      { enableHighAccuracy: true }
    );
  };

  const pickOrCapture = async (mode: 'camera' | 'gallery') => {
    const res =
      mode === 'camera'
        ? await launchCamera({ mediaType: 'photo', includeBase64: true })
        : await launchImageLibrary({ mediaType: 'photo', includeBase64: true });

    const asset: Asset | undefined = res.assets?.[0];
    if (asset?.uri && asset.base64) {
      setImageUri(asset.uri);
      setBase64Image(asset.base64);
    }
  };

  const embedMetadata = () => {
    if (!base64Image) return alert('Please select or capture an image first.');
    const dataToEmbed = { ...cargo, gps };
    const html = `
      <html><body>
      <script src="https://cdn.jsdelivr.net/npm/piexifjs"></script>
      <script>
        const img = "data:image/jpeg;base64,${base64Image}";
        const meta = ${JSON.stringify(dataToEmbed)};
        const ex = {"0th":{},Exif:{},GPS:{},1st:{},thumbnail:null};
        ex["0th"][piexif.ImageIFD.ImageDescription] = meta.desc;
        ex["0th"][piexif.ImageIFD.Make] = "CargoID:"+meta.id;
        ex["Exif"][piexif.ExifIFD.UserComment] =
          "L:"+meta.length+" W:"+meta.width+" H:"+meta.height+" WT:"+meta.weight;
        if(meta.gps.lat) {
          ex["GPS"][piexif.GPSIFD.GPSLatitudeRef] = meta.gps.lat >= 0 ? "N" : "S";
          ex["GPS"][piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.dmsRational(Math.abs(meta.gps.lat));
          ex["GPS"][piexif.GPSIFD.GPSLongitudeRef] = meta.gps.lon >= 0 ? "E" : "W";
          ex["GPS"][piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.dmsRational(Math.abs(meta.gps.lon));
        }
        const dump = piexif.dump(ex);
        const out = piexif.insert(dump, img);
        window.ReactNativeWebView.postMessage(out);
      </script></body></html>`;
    setEmbedHtml(html);
  };

  const onMessage = async (e: any) => {
    const data = e.nativeEvent.data.replace(/^data:image\/jpeg;base64,/, '');
    const path = `${RNFS.ExternalDirectoryPath}/cargo_${Date.now()}.jpg`;
    await RNFS.writeFile(path, data, 'base64');
    alert('Image saved with embedded metadata at:\n' + path);
    setEmbedHtml('');
  };

  const CustomButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <CustomButton title="📷 Camera" onPress={() => pickOrCapture('camera')} />
          <CustomButton title="🖼️ Library" onPress={() => pickOrCapture('gallery')} />
        </View>

        {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} /> : null}

        <TextInput
          style={styles.input}
          placeholder="Enter Cargo ID"
          placeholderTextColor="#888"
          value={cargo.id}
          onChangeText={text => setCargo({ ...cargo, id: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={cargo.weight}
          onChangeText={text => setCargo({ ...cargo, weight: text })}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe cargo contents"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={cargo.desc}
          onChangeText={text => setCargo({ ...cargo, desc: text })}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.dimInput]}
            placeholder="L"
            placeholderTextColor="#888"
            value={cargo.length}
            onChangeText={text => setCargo({ ...cargo, length: text })}
          />
          <TextInput
            style={[styles.input, styles.dimInput]}
            placeholder="W"
            placeholderTextColor="#888"
            value={cargo.width}
            onChangeText={text => setCargo({ ...cargo, width: text })}
          />
          <TextInput
            style={[styles.input, styles.dimInput]}
            placeholder="H"
            placeholderTextColor="#888"
            value={cargo.height}
            onChangeText={text => setCargo({ ...cargo, height: text })}
          />
        </View>

        <CustomButton
          title={gps.lat ? `📍 ${gps.lat.toFixed(5)}, ${gps.lon?.toFixed(5)}` : '📍 Get Location'}
          onPress={requestLocation}
        />

        <CustomButton title="💾 Save Cargo Data" onPress={embedMetadata} />

        <Text style={styles.footer}>Powered by Swiss Digital Solutions</Text>

        {embedHtml ? (
          <WebView source={{ html: embedHtml }} onMessage={onMessage} style={{ height: 0, width: 0 }} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  imagePreview: {
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
});
