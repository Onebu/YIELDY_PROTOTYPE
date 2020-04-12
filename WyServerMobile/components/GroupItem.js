import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card';

const GroupItem = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <Card style={styles.product}>
            <View style={styles.touchable}>
                <LinearGradient colors={['#4CB8C4', '#3CD3AD']} style={styles.gradientContainer}>
                    <TouchableCmp onPress={props.onSelect} useForeground>
                        <View>
                            <View style={styles.details}>
                                <Text style={styles.title}>{props.name}</Text>
                            </View>
                            <View style={styles.actions}>
                                {props.children}
                            </View>
                        </View>
                    </TouchableCmp>
                </LinearGradient>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    product: {
        height: 150,
        margin: 15,
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    details: {
        alignItems: 'flex-end',
        height: '56%',
        padding: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    actions: {
        flexDirection: 'column',
        alignItems:'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    gradientContainer: {
        width: "100%",
        height: "100%",
    }
});

export default GroupItem;
