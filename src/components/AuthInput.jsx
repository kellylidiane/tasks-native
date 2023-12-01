import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default props => {
    return (
        <View style={[styles.container, props.style]}>
            <Icon style={styles.icon} size={20} name={props.icon} />
            <TextInput {...props} style={styles.input} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#333',
        marginLeft: 20,
    },
    input: {
        marginLeft: 20,
        width: '70%',
    },
});
