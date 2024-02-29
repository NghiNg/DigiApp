let RandManager = require('./RandManager');
let Swiper = require('react-native-swiper');
import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Circle} from 'react-native-progress';
import NetworkImage from 'react-native-image-progress';

const NUM_WALLPAPERS = 5;
export const SplashWalls = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [wallsJSON, setWallsJSON] = useState<Array<any>>([]);
  let imagePanResponder = useRef<PanResponderInstance>({});
  console.log(imagePanResponder);
  const renderLoadingMessage = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={'#fff'}
          size={'small'}
          style={styles.loading}
        />
        <Text>Contacting Unsplash</Text>
      </View>
    );
  };

  const renderResults = () => {
    return (
      <Swiper
        showsPagination={true}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        loop={false}>
        {wallsJSON.map((wallpaper, id) => {
          return (
            <React.Fragment key={id}>
              <NetworkImage
                source={{
                  uri: `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`,
                }}
                indicator={Circle}
                style={styles.wallpaperImage}
                indicatorProps={{
                  color: 'rgb(255, 255, 255)',
                  size: 60,
                  thickness: 7,
                }}
                {...imagePanResponder.current.panHandlers}
              />
              <Text style={styles.label}>Photo by</Text>
              <Text style={styles.label_authorName}>{wallpaper.author}</Text>
            </React.Fragment>
          );
        })}
      </Swiper>
    );
  };

  useEffect(() => {
    const fetchWallsJSON = () => {
      const url = 'https://unsplash.it/list';
      fetch(url)
        .then(response => response.json())
        .then(jsonData => {
          let randomIds = RandManager.uniqueRandomNumbers(
            NUM_WALLPAPERS,
            0,
            jsonData.length,
          );
          let walls: any[] = [];
          randomIds.forEach((randomId: number) => {
            walls.push(jsonData[randomId]);
          });
          setWallsJSON(wallsJSON.concat(walls));
          setIsLoading(false);
        })
        .catch(error => console.log('Fetch error ' + error));
    };
    fetchWallsJSON();
    const handleStartShouldSetPanResponder = (e, gestureState) => {
      return true;
    };
    const handlePanResponderGrant = (e, gestureState) => {
      console.log('Finger touched the image');
    };
    const handlePanResponderEnd = (e, gestureState) => {
      console.log('Finger pulled up from the image');
    };
    imagePanResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderRelease: handlePanResponderEnd,
      onPanResponderTerminate: handlePanResponderEnd,
    });
    console.log('settinge useEffect');
  }, []);

  if (isLoading) {
    return renderLoadingMessage();
  } else {
    return renderResults();
  }
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255,.4)',
    width: 8,
    height: 8,
    borderRadius: 10,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  loading: {
    margin: 15,
    color: '#fff',
  },
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width / 2,
  },
  label_authorName: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: width / 2,
  },
});
