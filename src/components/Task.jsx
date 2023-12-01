import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {
    GestureHandlerRootView,
    Swipeable,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../commonStyles';
import moment from 'moment';
import 'moment/locale/pt-br';

export default props => {
    const doneStyle = props.doneAt
        ? { textDecorationLine: 'line-through' }
        : {};
    const date = props.doneAt || props.estimatedDate;

    const formatedDate = moment(date)
        .locale('pt-br')
        .format('ddd, D [de] MMMM');

    const getCheckView = done => {
        if (done) {
            return (
                <View style={styles.done}>
                    <Icon name="check" size={20} color={'#fff'} />
                </View>
            );
        }

        return <View style={styles.pending}></View>;
    };

    const getRightContent = () => {
        return (
            <TouchableOpacity
                style={styles.swipeRight}
                onPress={() => props.onDelete(props.id)}>
                <Icon name="trash" size={30} color={'#FFF'} />
            </TouchableOpacity>
        );
    };

    const getLeftContent = () => {
        return (
            <TouchableOpacity style={styles.swipeLeft}>
                <Icon
                    name="trash"
                    size={20}
                    color={'#FFF'}
                    style={styles.deleteIcon}
                />
                <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={getRightContent}
                renderLeftActions={getLeftContent}
                onSwipeableLeftOpen={() => props.onDelete(props.id)}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback
                        onPress={() => props.toggleTaskStatus(props.id)}>
                        <View style={styles.checkContainer}>
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.description, doneStyle]}>
                            {props.description}
                        </Text>
                        <Text style={styles.date}>{formatedDate}</Text>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555',
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15,
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12,
    },
    swipeRight: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    swipeLeft: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    deleteText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10,
    },
    deleteIcon: {
        marginLeft: 10,
    },
});
