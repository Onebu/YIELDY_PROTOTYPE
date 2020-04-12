import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    Platform,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../../components/HeaderButton';
import * as groupActions from '../../store/actions/group';
import GroupItem from '../../components/GroupItem';
import Colors from '../../constants/colors';
import MainButton from '../../components/MainButton';


const GroupScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const groups = useSelector(state => state.group.groups);

    const dispatch = useDispatch();

    const loadGroups = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(groupActions.fetchgroup());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadGroups
        );

        return () => {
            willFocusSub.remove();
        };
    }, [loadGroups]);

    useEffect(() => {
        setIsLoading(true);
        loadGroups().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadGroups]);

    const selectItemHandler = (id,name) => {
        props.navigation.navigate('GroupDetail',{
            groupId: id,
            name: name
        });
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadGroups}
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
                    onRefresh={loadGroups}
                    data={groups.sort((a, b) => b.servers.length - a.servers.length)}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    alignItems='center'
                    refreshing={isRefreshing}
                    renderItem={itemData => (
                        <GroupItem
                            name={itemData.item.name}
                            onSelect={() => {
                                selectItemHandler(itemData.item._id,itemData.item.name);
                            }}
                        >
                            <View marginBottom={6}>
                                <Text>{itemData.item.servers.length} Servers Connected</Text>
                            </View>
                            <MainButton
                                color={Colors.primary}
                                onPress={() => {
                                    selectItemHandler(itemData.item._id,itemData.item.name);
                                }}
                            > View Details</MainButton>
                        </GroupItem>
                    )}
                />
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#3498db' title="Refresh" onPress={loadGroups}>
                        <Icon name="md-refresh" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Create group" onPress={() => {
                        props.navigation.navigate({ routeName: 'AddGroup' })
                    }}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </LinearGradient>
        </View>
    );
};

GroupScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Groups',
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

export default GroupScreen;