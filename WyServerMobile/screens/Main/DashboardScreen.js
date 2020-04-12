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

import HeaderButton from '../../components/HeaderButton';
import * as commentActions from '../../store/actions/comment';
import Colors from '../../constants/colors';

const DashboardScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const comments = useSelector(state => state.comment.relatedComments);
    const dispatch = useDispatch();

    BackHandler.addEventListener('hardwareBackPress', function() {
        return true;
    });

    const loadComments = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(commentActions.fetchrelatedcomments());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadComments
        );

        return () => {
            willFocusSub.remove();
        };
    }, [loadComments]);

    useEffect(() => {
        setIsLoading(true);
        loadComments().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadComments]);

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
                    onPress={loadComments}
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
    if (comments.length <= 0) {
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
                    onRefresh={loadComments}
                    data={comments?comments.sort((a, b) => a.dataAdded.localeCompare(b.dataAdded)).reverse():null}
                    keyExtractor={item => item._id}
                    alignItems='center'
                    width='100%'
                    refreshing={isRefreshing}
                    inverted
                    renderItem={itemData => (
                        <View style={{ width: 400,padding:5}}>
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
                                leftAvatar={{ rounded: true, source:  { uri:(itemData.item.type === 'user' ?"https://img.icons8.com/carbon-copy/100/000000/user.png" :"https://img.icons8.com/pastel-glyph/64/000000/system-task.png" ) } }}
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
                                onPress={()=>{
                                    selectItemHandler(itemData.item.group._id,itemData.item.group.name);
                                }}
                                onLongPress={()=>{Toast.show("Group: "+itemData.item.group.name)}}
                            />
                        </View>
                    )}
                />
            </LinearGradient>
        </View>
    );
};

DashboardScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Dashboard',
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

export default DashboardScreen;