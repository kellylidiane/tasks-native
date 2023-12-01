import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthInput from '../components/AuthInput';
import backgroundImage from '../../assets/imgs/login.jpg';
import { server, showError, showSuccess } from '../common';

import commonStyles from '../commonStyles';

export default props => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [validForm, setValidForm] = useState(false);

    useEffect(() => {
        const validations = [];
        validations.push(email && email.includes('@'));
        validations.push(password && password.length >= 6);
        if (newUser) {
            validations.push(password === confirmPassword);
            validations.push(name && name.trim().length >= 2);
        }
        setValidForm(validations.reduce((t, a) => t && a));
    }, [email, password, confirmPassword, name]);

    const cleanState = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNewUser(false);
    };

    const signinOrSignup = () => {
        if (newUser) {
            signUp();
        } else {
            signIn();
        }
    };

    const signUp = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name,
                email,
                password,
                confirmPassword,
            });
            showSuccess('Usuário cadastrado!');
            cleanState();
        } catch (e) {
            showError(e);
        }
    };

    const signIn = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email,
                password,
            });
            AsyncStorage.setItem('userData', JSON.stringify(res.data));
            axios.defaults.headers.common[
                'Authorization'
            ] = `bearer ${res.data.token}`;
            // props.navigation.navigate('Home', res.data);
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Home',
                            params: res.data,
                        },
                    ],
                }),
            );
        } catch (e) {
            showError(e);
        }
    };

    return (
        <ImageBackground style={styles.background} source={backgroundImage}>
            <Text style={styles.title}>Tasks</Text>
            <View style={styles.formContainer}>
                <Text style={styles.subtitle}>
                    {newUser ? 'Crie sua conta' : 'Informe seus dados'}
                </Text>
                {newUser ? (
                    <AuthInput
                        icon="user"
                        placeholder="Nome"
                        value={name}
                        style={styles.input}
                        onChangeText={value => setName(value)}
                    />
                ) : null}
                <AuthInput
                    icon="at"
                    placeholder="E-mail"
                    value={email}
                    style={styles.input}
                    onChangeText={value => setEmail(value)}
                />
                <AuthInput
                    icon="lock"
                    placeholder="Senha"
                    secureTextEntry
                    value={password}
                    style={styles.input}
                    onChangeText={value => setPassword(value)}
                />
                {newUser ? (
                    <AuthInput
                        icon="asterisk"
                        placeholder="Confirme a senha"
                        value={confirmPassword}
                        secureTextEntry
                        style={styles.input}
                        onChangeText={value => setConfirmPassword(value)}
                    />
                ) : null}
                <TouchableOpacity
                    onPress={signinOrSignup}
                    disabled={!validForm}>
                    <View
                        style={[
                            styles.button,
                            validForm ? {} : { backgroundColor: '#AAA' },
                        ]}>
                        <Text style={styles.labelButton}>
                            {newUser ? 'Registrar' : 'Entrar'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => setNewUser(!newUser)}>
                <Text style={styles.labelButton}>
                    {newUser ? 'Já possui conta?' : 'Novo usuário?'}
                </Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0, 0.75)',
        padding: 20,
        width: '90%',
        borderRadius: 5,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    labelButton: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
});
