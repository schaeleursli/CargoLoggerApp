import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Button, TextInput, Text, Image,
  PermissionsAndroid, Platform
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
  const [cargo, setCargo] = useState<CargoData>({ id:'', desc:'', length:'', width:'', height:'', weight:'' });
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
    const res = mode === 'camera'
      ? await launchCamera({ mediaType: 'photo', includeBase64: true })
      : await launchImageLibrary({ mediaType: 'photo', includeBase64: true });

    const asset: Asset | undefined = res.assets?.[0];
    if (asset?.uri && asset.base64) {
      setImageUri(asset.uri);
      setBase64Image(asset.base64);
    }
  };

  const embedMetadata = () => {
    if (!base64Image) return alert('Take or select a photo first');
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
    const path = RNFS.ExternalDirectoryPath + `/cargo_${Date.now()}.jpg`;
    await RNFS.writeFile(path, data, 'base64');
    alert('Saved image to: ' + path);
    setEmbedHtml('');
  };

  return (
    <SafeAreaView style={{flex:1, padding:10}}>
      <ScrollView>
        <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:10}}>
          <Button title="Camera" onPress={() => pickOrCapture('camera')} />
          <Button title="Gallery" onPress={() => pickOrCapture('gallery')} />
          <Button title="Get GPS" onPress={requestLocation} />
        </View>

        {imageUri ? <Image source={{uri: imageUri}} style={{height:200, marginBottom:10}} /> : null}

        {(['id','desc','length','width','height','weight'] as (keyof CargoData)[]).map(field => (
          <TextInput
            key={field}
            placeholder={field.toUpperCase()}
            value={cargo[field]}
            onChangeText={t => setCargo({...cargo, [field]: t})}
            style={{borderWidth:1,padding:8,marginVertical:4}}
          />
        ))}

        <Text style={{marginVertical:5}}>
          GPS: {gps.lat?.toFixed(6)}, {gps.lon?.toFixed(6)}
        </Text>

        <Button title="Embed & Save" onPress={embedMetadata} />

        {embedHtml ? (
          <WebView source={{html: embedHtml}} onMessage={onMessage} style={{height:0,width:0}} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
