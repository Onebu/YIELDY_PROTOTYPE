import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DrawerProfile = props => {
    return (
        <LinearGradient colors={['#ffe1ff', '#11edff']}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: props.image ? props.image : 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />
                </View>

                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{props.name}</Text>
                        <Text style={styles.info}>{props.email}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "60%",
        flexDirection: 'column',
    },
    imageContainer: {
        width: "100%",
        height: "70%",
        borderRadius: 40,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        overflow: 'hidden',
        //marginVertical: 10
    },
    image: {
        width: '100%',
        height: '100%'
    },
    name: {
        marginTop: 5,
        fontSize: 22,
        color: "#FFFFFF",
    },
    body: {
        flex: 1,
        width: "100%",
        height: 60,
        justifyContent: 'flex-end',
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
        marginTop: 5,
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
});

export default DrawerProfile;