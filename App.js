import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import {Image as ImageCompressor} from 'react-native-compressor';
import Modal from 'react-native-modal';
const App = () => {
  const device = useCameraDevice('front');
  const ref = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
  };
  const takePicture = async () => {
    if (ref.current !== null) {
      const photo = await ref.current.takePhoto({
        qualityPrioritization: 'speed', // Minimize processing time and file size
        quality: 0.1,
      });

      try {
        // Compress the image using react-native-compressor
        const compressedImagePath = await ImageCompressor.compress(photo.path, {
          compressionMethod: 'auto', // Auto compression to balance quality and size
          // quality: 1,
          // maxWidth: 250,
          maxHeight: 3000,
        });

        // Convert the compressed image to base64
        const base64Imagedata = await RNFS.readFile(
          compressedImagePath,
          'base64',
        );
        console.log('base64Imagedata::::::', base64Imagedata);

        // Prepare the base64 data URL
        const fullBase64 = 'data:image/jpg;base64,' + base64Imagedata;
        setCapturedImage(fullBase64);
        setIsModalVisible(false)
        console.log('Compressed Image Path:', compressedImagePath);
      } catch (error) {
        console.error('Error during image compression:', error);
      }
    }
  };

  if (!device)
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View>
        {capturedImage != '' ? (
          <Image
            resizeMode="cover"
            style={{
              height: 180,
              width: 180,
              borderRadius: 100,
              marginTop: 20,
            }}
            source={{uri: capturedImage}}
          />
        ) : (
          <Image
            resizeMode="cover"
            style={{
              height: 180,
              width: 180,
              borderRadius: 100,
              marginTop: 20,
            }}
            source={require('./assets/user.png')}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(!isModalVisible);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 50,
          backgroundColor:'blue',
          paddingVertical:5,
          paddingHorizontal:10,
          borderRadius:15
        }}>
        <Text
          style={{
            color: 'white',
            fontWeight: '500',
            fontSize: 14,
            marginRight: 10,
          }}>
          Take Photo
        </Text>
        <Image
          resizeMode="contain"
          style={{
            height: 20,
            width: 20,
            tintColor: 'white',
          }}
          source={require('./assets/camera.png')}
        />
      </TouchableOpacity>
      <Modal
        hasBackdrop={true}
        backdropOpacity={0.9}
        backdropColor={'grey'}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={isModalVisible} //
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={500}
        // onBackButtonPress={() => setproductmodalVisible(false)}
        // onBackdropPress={() => setproductmodalVisible(false)}
      >
        <View style={{flex: 1, zIndex: 1}}>
          <View style={styles.container}>
            <Camera
              ref={ref}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
              // outputOrientation="portrait"
              orientation="portrait"
            />
          </View>
          <View
            style={{
              zIndex: 12,
              position: 'absolute',
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderColor: 'green',
                borderWidth: 4,
                height: 300,
                width: 300,
              }}></View>

            <View
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
                  }}>
                  <View
                    style={{
                      backgroundColor: 'red',
                      height: 40,
                      width: 40,
                      borderRadius: 100,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 40,
                      marginRight: 20,
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        height: 24,
                        width: 24,
                      }}
                      source={require('./assets/back.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                width: '100vw',
                height: '100%',
                position: 'absolute',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity onPress={() => takePicture()}>
                <View
                  style={{
                    backgroundColor: '#010080',
                    height: 60,
                    width: 60,
                    borderRadius: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}>
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: 32,
                      width: 32,
                    }}
                    source={require('./assets/camera.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#567DF4',
    borderRadius: 0,
    color: '#FFFFFF',
  },
});
