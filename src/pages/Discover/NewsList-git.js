/*
 * @Author: shuaixc 
 * @Date: 2017-09-27 15:16:02 
 * @Last Modified by: shuaixc
 * @Last Modified time: 2017-09-27 18:32:40
 */

'use strict';
import React, { Component } from 'react';
import {
	Dimensions, Image, StyleSheet
} from 'react-native';

import API from '../../utils/api';



const per_page = 10;
let pageIndex = 1;

// 数据容器，用来存储数据
let dataContainer = [];


/**
 * 
 * 
 * @class NewsList
 * @extends {Component}
 */
class NewsList extends Component {


	static navigationOptions = {
		title: 'NewsList',
	}

	constructor(props) {
		super(props);

		this.state = {
			sourceData: []
			, selected: new Map()
			, refreshing: false
		};
	}

	componentDidMount() {
		API.getRepositories(per_page, pageIndex)
			.then((responseData) => {
				let data = responseData.items;
				// let dataBlob = [];

				data.map(function (item) {
					dataContainer.push(item);
				});
				this.setState({
					//复制数据源
					sourceData: dataContainer,
					isLoading: false,
				});

				data = null;
				// dataBlob = null;

			})
			.catch((error) => {
				this.setState({
					error: true,
					errorInfo: error
				});
			})
			.done();

	}

	/**
     * 此函数用于为给定的item生成一个不重复的Key。
     * Key的作用是使React能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。
     * 若不指定此函数，则默认抽取item.key作为key值。
     * 若item.key也不存在，则使用数组下标
     *
     * @param item
     * @param index
     * @private
     */
	// 这里指定使用数组下标作为唯一索引
	_keyExtractor = (item, index) => index;

	/**
     * 使用箭头函数防止不必要的re-render；
     * 如果使用bind方式来绑定onPressItem，每次都会生成一个新的函数，导致props在===比较时返回false，
     * 从而触发自身的一次不必要的重新render，也就是FlatListItem组件每次都会重新渲染。
     *
     * @param id
     * @private
     */
	_onPressItem = (id) => {


		this.setState((state) => {
			const selected = new Map(state.selected);
			selected.set(id, !selected.get(id));

			return { selected };
		});

		const { navigate } = this.props.navigation;
		navigate('NewsDetail', { user: 'jim' });

	};

	// Header布局
	_renderHeader = () => (
		<View><Text>Header</Text></View>
	);

	// Footer布局
	_renderFooter = () => (
		<View><Text style={{ justifyContent: 'center' }}>loading more</Text></View>
	);

	// 自定义分割线
	_renderItemSeparatorComponent = ({ highlighted }) => (
		<View style={{ height: 1, backgroundColor: '#58a' }}></View>
	);

	// 空布局
	_renderEmptyView = () => (
		<View><Text>EmptyView</Text></View>
	);

	// 下拉刷新
	_renderRefresh = () => {
		this.setState({ refreshing: true }); // 开始刷新
		// 这里模拟请求网络，拿到数据，3s后停止刷新
		setTimeout(() => {
			// TODO 提示没有可刷新的内容！
			this.setState({ refreshing: false });
		}, 3000);
	};

	// 上拉加载更多
	_onEndReached = () => {

		//排除第一次
		if (this.state.sourceData.length < 1) {
			return;
		}

		pageIndex++;

		console.log('onEndReached,pageIndex:', pageIndex);

		API.getRepositories(per_page, pageIndex)
			.then((responseData) => {
				let data = responseData.items;
				data.map(function (item) {
					dataContainer.push(item);
				});
				this.setState({
					//复制数据源
					sourceData: dataContainer,
					isLoading: false,
				});

				data = null;
				// dataBlob = null;

			})
			.catch((error) => {
				this.setState({
					error: true,
					errorInfo: error
				});
			})
			.done();


	};

	_renderItem = ({ item }) => {
		return (
			<FlatListItem
				/* style={[{ height: 134 }]} */
				id={item.id}
				onPressItem={this._onPressItem}
				selected={!!this.state.selected.get(item.id)}
				title={item.name}
				content={item.content}
				img={item.owner.avatar_url}
				stargazers_count={item.stargazers_count}
				description={item.description}
			/>

		);

	};

	render() {
		console.log('render..........');
		return (
			<FlatList

				//windowSize={40}
				//windowSize： 限定绘制的最大数目，默认为21。/
				//maxToRenderPerBatch：一次绘制的最大数目。
				//updateCellsBatchingPeriod：更新绘制的间隔时间。
				//removeClippedSubviews：移除看不见的subview，目前还有bug，可酌情使用。
				//initialNumToRender：首次绘制的数目。

				data={this.state.sourceData}
				extraData={this.state.selected}
				keyExtractor={this._keyExtractor}
				renderItem={this._renderItem}
				// 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
				onEndReachedThreshold={0.9}
				// 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
				onEndReached={this._onEndReached.bind(this)}

				ListHeaderComponent={this._renderHeader}
				ListFooterComponent={this._renderFooter}
				ItemSeparatorComponent={this._renderItemSeparatorComponent}
				ListEmptyComponent={this._renderEmptyView}
				refreshing={this.state.refreshing}
				onRefresh={this._renderRefresh}
				// 是一个可选的优化，用于避免动态测量内容，+1是加上分割线的高度  
				//此处数字 应与真实高度相等   否则起反作用  会白屏
				getItemLayout={(data, index) => ({ length: 80, offset: (80 + 1) * index, index })}
			/>
		);
	}
}

class FlatListItem extends PureComponent {
	_onPress = () => {


		this.props.onPressItem(this.props.id);
	};

	render() {
		return (
			<TouchableOpacity
				{...this.props}
				onPress={this._onPress}
				style={{ height: 80, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}
			>
				<Image
					style={[{ height: 60, width: 60, borderRadius: 5, margin: 5 }]}
					source={{ uri: this.props.img }}
				/>
				<View style={{ justifyContent: 'center', padding: 5 }}>
					<Text style={styles.title}>name: {this.props.title} ({this.props.stargazers_count}
						stars)</Text>
					<Text style={styles.content}> {this.props.description}</Text>
				</View>

			</TouchableOpacity>
		);
	}
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	title: {

		fontSize: 15,
		color: 'blue',
	},
	content: {
		fontSize: 15,
		color: 'black',
	},

	box: {
		flex: 1,
		borderBottomColor: 'red',
		borderBottomWidth: 1,
	}


});


export default NewsList;