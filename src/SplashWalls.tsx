let RandManager = require('./RandManager');
let Swiper = require('react-native-swiper');
import React, {ReactElement, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const NUM_WALLPAPERS = 5;
export const SplashWalls = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [wallsJSON, setWallsJSON] = useState<Array<any>>([]);

  const renderLoadingMessage = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}}
        />
        <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
      </View>
    );
  };

  const renderResults = () => {
    return (
      <Swiper
        showsPagination={true}
        dot={
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255,.4)',
              width: 8,
              height: 8,
              borderRadius: 10,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: '#fff',
              width: 13,
              height: 13,
              borderRadius: 7,
              marginLeft: 7,
              marginRight: 7,
            }}
          />
        }
        loop={false}>
        {wallsJSON.map((wallpaper, index) => {
          return <Text key={index}>{wallpaper.author}</Text>;
        })}
      </Swiper>
    );
  };

  useEffect(() => {
    const fetchWallsJSON = () => {
      var url = 'https://unsplash.it/list';
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
  }, []);

  if (isLoading) {
    return renderLoadingMessage();
  } else {
    return renderResults();
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
