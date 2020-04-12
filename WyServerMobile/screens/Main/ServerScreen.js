import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    ActivityIndicator,
    StyleSheet,
    Platform,
    SafeAreaView,
    ScrollView,
    Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableScale from 'react-native-touchable-scale';
import { ListItem } from 'react-native-elements';
import Toast from 'react-native-tiny-toast';

import HeaderButton from '../../components/HeaderButton';
import * as serverActions from '../../store/actions/server';
import Colors from '../../constants/colors';
import Card from '../../components/Card';

const ServerScreen = props => {
    const serverId = props.navigation.getParam('serverId');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const server = useSelector(state => state.server.server);
    const dispatch = useDispatch();
    
    const loadContents = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(serverActions.fetchserverbyid(serverId));
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadContents
        );

        return () => {
            willFocusSub.remove();
        };
    }, [loadContents]);

    useEffect(() => {
        setIsLoading(true);
        loadContents().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadContents]);


    if (error) {
        return (
            <View style={styles.screen}>
                <View style={styles.centered}>
                    <Text>{error}</Text>
                    <Button
                        title="Try again"
                        onPress={loadContents}
                        color={Colors.primary}
                    />
                </View>
            </View>
        );
    }

    if (isLoading || isRefreshing) {
        return (
            <View style={styles.screen}>
                <View style={styles.centered}>
                    <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.gradientContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </LinearGradient>
                </View>
            </View>
        );
    };
    return (
        //Change it to serverItem component
        <View style={styles.screen}>
            <FlatList
                onRefresh={loadContents}
                data={server}
                keyExtractor={item => item._id}
                alignItems='center'
                refreshing={isRefreshing}
                renderItem={itemData => (
                    <Card style={styles.authContainer}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: 'https://www.clipartwiki.com/clipimg/detail/25-258363_cloud-server-clipart-svg-transparent-background-server-icon.png' }} />
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text textAlign='left'>Server's Name:  </Text>
                            <Text textAlign='right'>{itemData.item.name}</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's ram:  </Text>
                            <Text>{itemData.item.ram} %</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's uptime:  </Text>
                            <Text>{itemData.item.uptime} mins</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's location:  </Text>
                            <Text>{itemData.item.location}</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's load:  </Text>
                            <Text>{itemData.item.load} kb/s</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's ipv6:  </Text>
                            <Text>{itemData.item.ipv6 ? "UP" : "DOWN"}</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's ipv4:  </Text>
                            <Text>{itemData.item.ipv4 ? "UP" : "DOWN"}</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's host:  </Text>
                            <Text>{itemData.item.host}</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's hdd:  </Text>
                            <Text>{itemData.item.hdd}%</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's uploads:  </Text>
                            <Text>{itemData.item.uploads} kb/s</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's downloads:  </Text>
                            <Text>{itemData.item.downloads} kb/s</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text>Server's CPU:  </Text>
                            <Text>{itemData.item.cpu}%</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text >Server's type:  </Text>
                            <Text>{itemData.item.type}</Text>
                        </View>
                    </Card>
                )}
            />
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#3498db' title="Refresh" onPress={loadContents}>
                    <Icon name="md-refresh" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    );
};

ServerScreen.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('name', 'Server\'s Detail'),
    headerRight: (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title="Start"
                iconName={Platform.OS === 'android' ? 'md-star' : 'ios-star'}
                onPress={() => {
                }}
            />
        </HeaderButtons>
    )
});

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroud
    },
    authContainer: {
        flex: 1,
        width: 380,
        height: 600,
        marginTop: 20,
        padding: 20
    },
    descriptionContainer: {
        height: "100%",
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    imageContainer: {
        width: '100%',
        height: '30%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ServerScreen;