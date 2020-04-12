import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    ActivityIndicator,
    StyleSheet,
    Platform,
    SafeAreaView
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
import GroupItem from '../../components/GroupItem';
import MainButton from '../../components/MainButton';

const ServerListScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const servers = useSelector(state => state.server.allServer);

    const dispatch = useDispatch();

    const loadServers = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(serverActions.fetchserverme());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadServers
        );

        return () => {
            willFocusSub.remove();
        };
    }, [loadServers]);

    useEffect(() => {
        setIsLoading(true);
        loadServers().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadServers]);

    const selectServerHandler = (id, name) => {
        props.navigation.navigate('Server', {
            serverId: id,
            name: name
        });
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadServers}
                    color={Colors.primary}
                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.groupContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.groupContainer}>
                <FlatList
                    onRefresh={loadServers}
                    data={servers}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    alignItems='center'
                    refreshing={isRefreshing}
                    renderItem={itemData => (
                        <GroupItem
                            name={itemData.item.name}
                            onSelect={() => {
                                selectServerHandler(itemData.item._id, itemData.item.name);
                            }}
                        >
                            <View marginBottom={6}>
                                <Text>Status: {itemData.item.ipv4?"UP":"DOWN"}</Text>
                            </View>
                            <MainButton
                                color={Colors.primary}
                                onPress={() => {
                                    selectServerHandler(itemData.item._id, itemData.item.name);
                                }}
                            > View Details</MainButton>
                        </GroupItem>
                    )}
                />
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#3498db' title="Refresh" onPress={loadServers}>
                        <Icon name="md-refresh" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </LinearGradient>
        </View>
    );
};
ServerListScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'My Servers',
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title="Menu" iconName="ios-menu" onPress={() => {
                navData.navigation.toggleDrawer();
            }} />
        </HeaderButtons>
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupContainer: {
        width: "100%",
        height: "100%",
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ServerListScreen;