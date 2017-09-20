/*
 * @Author: shuaixc
 * @Date: 2017-09-12 12:14:18
 * @Last Modified by: shuaixc
 * @Last Modified time: 2017-09-20 11:47:24
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';

// import MainScreenNavigator from './MainScreenNavigator';

import NewsDetailScreen from '../pages/Discover/NewsDetailScreen';
import NewsDetailScreen2 from '../pages/Discover/NewsDetailScreen2';
import ListViewExample from '../pages/Admin/ListViewExample';

import ChatContainer from './ChatContainer';
import BookContainer from './BookContainer';
import AdminContainer from './AdminContainer';
import DiscoverContainer from './DiscoverContainer';
import MineContainer from './MineContainer';

const msgIcon = require('../image/mine.png');
const bookIcon = require('../image/mine.png');
const adminIcon = require('../image/mine.png');
const discoverIcon = require('../image/mine.png');
const mineIcon = require('../image/mine.png');

const styles = StyleSheet.create({
	icon: {
		width: 26,
		height: 26
	}
});

const TabContainer = TabNavigator({
	Msg: {
		screen: ChatContainer,
		navigationOptions: {
			title: '消息',
			// Note: By default the icon is only shown on iOS. Search the showIcon option
			// below.
			tabBarIcon: ({ tintColor }) => <Image
				source={msgIcon}
				style={[styles.icon, {
					tintColor
				}]} />
		}
	},

	Book: {
		screen: BookContainer,
		navigationOptions: {
			title: '通讯录',
			tabBarIcon: ({ tintColor }) => <Image
				source={bookIcon}
				style={[styles.icon, {
					tintColor
				}]} />
		}
	},

	Admin: {
		screen: AdminContainer,
		navigationOptions: {
			title: '管理',
			tabBarIcon: ({ tintColor }) => <Image source={adminIcon} style={[styles.icon, { tintColor }]} />
		}
	},

	Discover: {
		screen: DiscoverContainer,
		navigationOptions: {
			title: '发现',
			tabBarIcon: ({ tintColor }) => <Image
				source={discoverIcon}
				style={[styles.icon, {
					tintColor
				}]}
			/>

		}
	},

	Mine: {
		screen: MineContainer,
		navigationOptions: {
			title: '我的',
			// Note: By default the icon is only shown on iOS. Search the showIcon option
			// below.
			tabBarIcon: ({ tintColor }) => <Image
				source={mineIcon}
				style={[styles.icon, {
					tintColor
				}]} />
		}
	}

}, {
	tabBarPosition: 'bottom',
	lazy: true, //  是否根据需要懒加载标签，而不是提前渲染
	// animationEnabled: true, //是否在切换标签时启动动画
	initialRouteName: 'Discover',

	tabBarOptions: {

		activeTintColor: '#29a1f7',
		inactiveTintColor: '#888',

		showIcon: true,

		pressOpacity: 0.1,

		indicatorStyle: {
			opacity: 0
		},
		tabStyle: {
			padding: 0
		},
		style: {
			height: 60,
			// border: 'none',
			backgroundColor: '#ccc',
			zIndex: 0,
			position: 'relative'
		},

		// tabStyle: {   backgroundColor: '#ccc', }, labelStyle: {   fontSize: 11,
		// paddingVertical: 0,   marginTop: -4 }, iconStyle: {   marginTop: -3 },

	}

});

const App = StackNavigator({
	Home: {
		screen: TabContainer
	},
	NewsDetail: {
		screen: NewsDetailScreen
	},
	NewsDetail2: {
		// `NewsDetailScreen2`是一个React组件，将作为屏幕的主要内容。
		screen: NewsDetailScreen2,
		// 当`ProfileScreen`由StackNavigator加载时，它将被赋予“navigation”属性。
		// 可选：在Web应用程序中深链接或使用react-navigation导航时，将使用此路径：  path: 'people/:name',
		// 从路径中提取动作(action)和路由参数.
		// 可选：覆盖屏幕的`navigationOptions`（即每个组件中的`navigationOptions`）
		navigationOptions: ({ navigation }) => ({ title: `${navigation.state.params.name}'s Profile'` })
	},

	ListViewExample: {
		screen: ListViewExample
	}
}
	// , { 	mode:'modal', }
);

export default App;
