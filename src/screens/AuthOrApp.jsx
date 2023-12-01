import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {
    useEffect(() => {
        const controlLogin = async () => {
            const userDataJson = await AsyncStorage.getItem('userData');
            let userData = null;

            try {
                userData = JSON.parse(userDataJson);
            } catch (error) {
                console.warn(error);
            }

            if (userData && userData.token) {
                axios.defaults.headers.common[
                    'Authorization'
                ] = `bearer ${userData.token}`;
                props.navigation.navigate('Home', userData);
            } else {
                props.navigation.navigate('Auth');
            }
        };

        controlLogin();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
