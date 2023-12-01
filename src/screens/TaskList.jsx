import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import axios from 'axios';

import { server, showError } from '../common';

import AddTask from './AddTask';
import Task from '../components/Task';

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';
import commonStyles from '../commonStyles';
import 'moment/locale/pt-br';

export default props => {
    const [showDoneTasks, setShowDoneTasks] = useState(true);
    const [showModalAddTask, setShowModalAddTask] = useState(false);
    const [visibleTasks, setVisibleTasks] = useState([]);
    const [tasks, setTasks] = useState([]);

    const getTasksStates = async () => {
        try {
            const showDoneTasksState = await AsyncStorage.getItem(
                'showDoneTasks',
            );

            if (showDoneTasksState !== null && JSON.parse(showDoneTasksState)) {
                setShowDoneTasks(JSON.parse(showDoneTasksState).showDoneTasks);
            }
        } catch (e) {
            console.warn(e);
        }
    };

    useEffect(() => {
        loadTasks();
        getTasksStates();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [showDoneTasks, tasks]);

    const today = moment()
        .add({ days: props.daysAhead })
        .locale('pt-br')
        .format('ddd, D [de] MMMM');

    const toggleTaskStatus = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`);
            loadTasks();
        } catch (error) {}
    };

    const loadTasks = async () => {
        try {
            const maxDate = moment()
                .add({ days: props.daysAhead })
                .format('YYYY-MM-DD 20:59:59');
            const res = await axios.get(`${server}/tasks?date=${maxDate}`);
            setTasks(res.data);
            filterTasks();
        } catch (error) {
            showError(error);
        }
    };

    const toggleVisibility = () => {
        const newVisibility = !showDoneTasks;
        setShowDoneTasks(newVisibility);
        AsyncStorage.setItem(
            'showDoneTasks',
            JSON.stringify({ showDoneTasks: newVisibility }),
        );
    };

    const filterTasks = () => {
        let filteredVisibleTasks = null;
        if (showDoneTasks) {
            filteredVisibleTasks = [...tasks];
        } else {
            const pending = task => !task.doneAt;
            filteredVisibleTasks = tasks.filter(pending);
        }

        setVisibleTasks(filteredVisibleTasks);
    };

    const addTask = async newTask => {
        if (!newTask.description.trim()) {
            Alert.alert('Dados inválidos', 'Preencha essa merda!');
            return;
        }

        try {
            await axios.post(`${server}/tasks`, {
                description: newTask.description,
                estimatedDate: newTask.date,
            });
        } catch (error) {
            showError(error);
        }

        setShowModalAddTask(false);
        loadTasks();
    };

    const deleteTask = async taskId => {
        try {
            await axios.delete(`${server}/tasks/${taskId}`);
            loadTasks();
        } catch (error) {
            showError(error);
        }
    };

    const getImage = () => {
        switch (props.daysAhead) {
            case 0:
                return todayImage;
            case 1:
                return tomorrowImage;
            case 7:
                return weekImage;
            default:
                return monthImage;
        }
    };

    const getColor = () => {
        switch (props.daysAhead) {
            case 0:
                return commonStyles.colors.today;
            case 1:
                return commonStyles.colors.tomorrow;
            case 7:
                return commonStyles.colors.week;
            default:
                return commonStyles.colors.month;
        }
    };

    return (
        <View style={styles.container}>
            <AddTask
                isVisible={showModalAddTask}
                onCancel={() => setShowModalAddTask(false)}
                onSave={addTask}
            />
            <ImageBackground source={getImage()} style={styles.background}>
                <View style={styles.iconBar}>
                    <TouchableOpacity
                        onPress={() => props.navigation.openDrawer()}>
                        <Icon
                            name={'bars'}
                            size={20}
                            color={commonStyles.colors.secondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleVisibility}>
                        <Icon
                            name={showDoneTasks ? 'eye' : 'eye-slash'}
                            size={20}
                            color={commonStyles.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={[styles.title, styles.subtitle]}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.taskList}>
                <FlatList
                    data={visibleTasks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <Task
                            {...item}
                            toggleTaskStatus={toggleTaskStatus}
                            onDelete={deleteTask}
                        />
                    )}
                />
            </View>
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getColor() }]}
                onPress={() => setShowModalAddTask(true)}
                activeOpacity={0.7}>
                <Icon
                    name="plus"
                    size={20}
                    color={commonStyles.colors.secondary}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    taskList: {
        flex: 7,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 30 : 10,
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
