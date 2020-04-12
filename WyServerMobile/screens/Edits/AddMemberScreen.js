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

const AddMemberScreen = props => {

    const groupId = props.navigation.getParam('groupId');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const members = useSelector(state => state.group.searchedUser);
    const dispatch = useDispatch();

    const addMember = useCallback(async (memberId, groupId) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(groupActions.addmember(memberId,groupId));
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    });

    if (error) {
        //console.log(error);
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
                        <Text>Search User by clicking the button</Text>
                        <Button 
                        title="Search" 
                        onPress={()=> {
                            props.navigation.navigate('SearchUser');
                        }}
                        />
                    </View>
                </LinearGradient>
            </View>
        );
    }
    return (
        <View style={styles.screen}>
            <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.groupContainer}>
                <FlatList
                    data={members}
                    keyExtractor={item => item._id}
                    alignItems='center'
                    width='100%'
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
                                onPress={() => {
                                    addMember(itemData.item._id, groupId);
                                    props.navigation.goBack();                               
                                 }}
                            />
                        </View>
                    )}
                />
            </LinearGradient>
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="Add Member" onPress={() => {
                    props.navigation.navigate('AddMember', { groupId: groupId })
                }}>
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    );
};

AddMemberScreen.navigationOptions ={
    headerTitle: 'AddMemberScreen'
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

export default AddMemberScreen;