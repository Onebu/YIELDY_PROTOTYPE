import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    ActivityIndicator,
    StyleSheet,
    BackHandler
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';
import TouchableScale from 'react-native-touchable-scale';
import { ListItem } from 'react-native-elements'
import Toast from 'react-native-tiny-toast';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import HeaderButton from '../../components/HeaderButton';
import * as groupActions from '../../store/actions/group';
import Colors from '../../constants/colors';


const MemberScreen = props => {
    const groupId = props.navigation.getParam('groupId');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const members = useSelector(state => state.group.groupParticipants);
    const dispatch = useDispatch();

    const loadMembers = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(groupActions.fetchgroupparticipants(groupId));
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadMembers
        );

        return () => {
            willFocusSub.remove();
        };
    }, [loadMembers]);

    useEffect(() => {
        setIsLoading(true);
        loadMembers(groupId).then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadMembers]);

    const removeMember = useCallback(async (memberId, groupId) => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(groupActions.removemember(memberId, groupId));
            await dispatch(groupActions.fetchgroupparticipants(groupId));
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    });

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
                <Button
                    title="Try again"
                    onPress={loadMembers}
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
    if (members.length <= 0) {
        return (
            <View style={styles.centered}>
                <LinearGradient colors={['#11edff', '#ffe1ff']} style={styles.groupContainer}>
                    <View style={styles.centered}>
                        <Text>You don't have any message to show!</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.groupContainer}>
                <FlatList
                    onRefresh={loadMembers}
                    data={members}
                    keyExtractor={item => item._id}
                    alignItems='center'
                    width='100%'
                    refreshing={isRefreshing}
                    renderItem={itemData => (
                        <View style={{ width: 400, padding: 5 }}>
                            <ListItem
                                Component={TouchableScale}
                                friction={90} //
                                tension={100} // These props are passed to the parent component (here TouchableScale)
                                activeScale={0.95} //                               
                                linearGradientProps={{
                                    colors: (['#33b3e2', '#33b3e2']),
                                    start: [1, 0],
                                    end: [0.2, 0],
                                }}
                                ViewComponent={LinearGradient} // Only if no expo
                                leftAvatar={{ rounded: true, source: { uri: "https://img.icons8.com/carbon-copy/100/000000/user.png" } }}
                                title={itemData.item.nickname}
                                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                                subtitleStyle={{ color: 'black' }}
                                subtitle={itemData.item.email}
                                chevron={{ color: 'black' }}
                                onPress={() => { }}
                                onLongPress={() => {
                                    removeMember(itemData.item._id, groupId);
                                }}
                            />
                        </View>
                    )}
                />
            </LinearGradient>
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#3498db' title="Refresh" onPress={loadMembers}>
                    <Icon name="md-refresh" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#9b59b6' title="Add Member" onPress={() => {
                    props.navigation.navigate('AddMember', { groupId: groupId })
                }}>
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    );
};

MemberScreen.navigationOptions = {
    headerTitle: 'Member'
};
const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    groupContainer: {
        width: "100%",
        height: "100%",
    },
    centered: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MemberScreen;