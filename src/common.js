import { Alert, Platform } from 'react-native';

const server =
    Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

const showError = err =>
    Alert.alert(
        'Erro!',
        err.response && err.response.data ? err.response.data : err,
    );

const showSuccess = msg => Alert.alert('Sucesso!', msg);

export { server, showError, showSuccess };
