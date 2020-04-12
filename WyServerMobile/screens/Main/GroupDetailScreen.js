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
import * as commentActions from '../../store/actions/comment';
import * as groupActions from '../../store/actions/group';
import Colors from '../../constants/colors';
import GroupItem from '../../components/GroupItem';
import MainButton from '../../components/MainButton';

const GroupDetailScreen = props => {
    const groupId = props.navigation.getParam('groupId');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const servers = useSelector(state => state.group.groupServerList);
    const comments = useSelector(state => state.comment.groupComments)
    const dispatch = useDispatch();
    const loadContents = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(groupActions.fetchgroupserver(groupId));
            await dispatch(commentActions.fetchgroupcomments(groupId));
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

    if (isLoading || isRefreshing) {
        return (
            <View style={styles.centered}>
                <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.gradientContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </LinearGradient>
            </View>
        );
    };

    const selectServerHandler = (id,name) => {
        props.navigation.navigate('Server',{
            serverId: id,
            name: name
        });
    };

    return (
        <View style={styles.screen}>
            <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.gradientContainer}>
                <View style={styles.serverContainer}>
                    <FlatList
                        flex={1}
                        data={servers}
                        horizontal
                        keyExtractor={item => item._id}
                        renderItem={itemData => 
                            (
                                <GroupItem
                                    name={itemData.item.name}
                                    onSelect={() => {
                                        selectServerHandler(itemData.item._id,itemData.item.name);
                                    }}
                                >
                                    <View marginBottom={6} >
                                        <Text>{itemData.item.ipv4?"Server is up":"Server is down"}</Text>
                                    </View>
                                    <MainButton
                                        color={Colors.primary}
                                        onPress={() => {
                                            selectServerHandler(itemData.item._id,itemData.item.name);
                                        }}
                                    > View Details</MainButton>
                                </GroupItem>
                            )
                        }
                    />
                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth
                    }}
                />
                <SafeAreaView style={styles.commentsContainer}>
                    <FlatList
                        data={comments.sort((a, b) => a.dataAdded.localeCompare(b.dataAdded)).reverse()}
                        keyExtractor={item => item._id}
                        alignItems='center'
                        width='100%'
                        inverted
                        renderItem={itemData => (
                            <View style={{ width: 400, padding: 5 }}>
                                <ListItem
                                    Component={TouchableScale}
                                    friction={90} //
                                    tension={100} // These props are passed to the parent component (here TouchableScale)
                                    activeScale={0.95} //
                                    linearGradientProps={{
                                        colors: (itemData.item.type === 'user' ? ['#FFFFFF','#FFFFFF'] : ['#7fb3e2', '#7fb3e2']),
                                        start: [1, 0],
                                        end: [0.2, 0],
                                    }}
                                    ViewComponent={LinearGradient} // Only if no expo
                                    leftAvatar={{ rounded: true, source: { uri: (itemData.item.type === 'user' ? "https://img.icons8.com/carbon-copy/100/000000/user.png" : "https://img.icons8.com/pastel-glyph/64/000000/system-task.png") } }}
                                    title={new Date(itemData.item.dataAdded)
                                        .getFullYear() + "-" +
                                        (new Date(itemData.item.dataAdded).getMonth() + 1) + "-" +
                                        new Date(itemData.item.dataAdded).getDate() + " " +
                                        new Date(itemData.item.dataAdded).getHours() + ":" +
                                        new Date(itemData.item.dataAdded).getMinutes() + ":" +
                                        new Date(itemData.item.dataAdded).getSeconds()}
                                    titleStyle={{ color: 'black', fontStyle: 'italic', fontSize: 10 }}
                                    rightTitle={itemData.item.type === 'user' ? itemData.item.publisher.nickname : 'SYSTEM'}
                                    rightTitleStyle={{ color: 'black', fontWeight: 'bold' }}
                                    subtitleStyle={{ color: 'black' }}
                                    subtitle={itemData.item.body}
                                    chevron={{ color: 'black' }}
                                />
                            </View>
                        )}
                    />
                </SafeAreaView>
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#3498db' title="Refresh" onPress={loadContents}>
                        <Icon name="md-refresh" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Publish" onPress={() => {
                        props.navigation.navigate('Publish' ,{groupId:groupId})
                    }}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </LinearGradient>
        </View>
    );
};

GroupDetailScreen.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('name', 'Group\'s Detail'),
    headerRight: (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title="Member"
                iconName={Platform.OS === 'android' ? 'md-information' : 'ios-information'}
                onPress={() => {
                    const groupId = navigation.getParam('groupId');
                    navigation.navigate('Member',{groupId:groupId});
                }}
            />
        </HeaderButtons>
    )
});
const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    serverContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    commentsContainer: {
        flex: 2.5,
    },
    gradientContainer: {
        width: "100%",
        height: "100%",
    },
});

export default GroupDetailScreen;