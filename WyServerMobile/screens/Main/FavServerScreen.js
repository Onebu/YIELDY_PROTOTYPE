import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/HeaderButton';




const FavServerScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>The FavServerScreen</Text>
        </View>
    );
};

FavServerScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'All Servers',
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
});

export default FavServerScreen;