import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import commonStyles from '../commonStyles';

export default props => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const resetState = () => {
        setDescription('');
        setDate(new Date());
        setShowDatePicker(false);
    };

    const save = () => {
        const newTask = {
            description,
            date,
        };

        props.onSave(newTask);
        resetState();
    };

    const getDatePicker = () => {
        let datePicker = (
            <DateTimePicker
                value={date}
                onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    setDate(selectedDate);
                }}
                mode="date"
            />
        );

        const dateString = moment(date).format('ddd, D [de] MMMM [de] YYYY');

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.date}>{dateString}</Text>
                    </TouchableOpacity>
                    {showDatePicker ? datePicker : null}
                </View>
            );
        }

        return datePicker;
    };

    return (
        <Modal
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.onCancel}
            animationType="slide">
            <TouchableWithoutFeedback onPress={props.onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
                <Text style={styles.header}>Nova Tarefa</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Descrição da tarefa"
                    value={description}
                    onChangeText={text => setDescription(text)}
                />
                {getDatePicker()}
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={props.onCancel}>
                        <Text style={styles.button}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={save}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={props.onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    container: {
        backgroundColor: '#FFF',
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18,
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today,
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15,
    },
});
