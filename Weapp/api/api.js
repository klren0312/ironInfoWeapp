import request from './request.js'
import store from '../store'

// 首页: 获取热门钢材
export function getHotIron () {
	return request ({
		url: `${store.state.rootUrl}/weapp/hot`,
		method: 'GET'
	})
}

// 首页: 获取文章
export function getArticle () {
	return request ({
		url: `${store.state.rootUrl}/weapp/article?status=true&pageIndex=1&pageSize=10`,
		method: 'GET'
	})
}

// 总览: 获取所有钢材
export function getAllIron () {
	return request ({
		url: `${store.state.rootUrl}/weapp/iron/all`,
		method: 'GET'
	})
}

// 搜索: 钢材搜索
export function searchIron (name) {
	return request ({
		url: `${store.state.rootUrl}/weapp/iron?name=${name}`,
		method: 'GET'
	})
}

// 搜索: 钢材联想
export function searchFind (name) {
	return request ({
		url: `${store.state.rootUrl}/weapp/iron/option?name=${name}`,
		method: 'GET'
	})
}

// 天气: 获取铜陵天气
export function getWeather () {
	return request ({
		url: `${store.state.rootUrl}/weapp/weather`,
		method: 'GET'
	})
}

// 天气: 获取新闻
export function getNews (url) {
	return request ({
		url: `${store.state.rootUrl}/weapp/news`,
		method: 'POST',
		data: {
			url: url
		}
	})
}

// 登录
export function login (crypted, iv, signature, code) {
	return request ({
		url: `${store.state.rootUrl}/weapp/login`,
		method: 'POST',
		data: {
			crypted: crypted,
			iv: iv,
			signature: signature,
			code: code
		}
	})
}

// 计数
export function countUser (openId, history) {
	console.log(openId)
	return request ({
		url: `${store.state.rootUrl}/weapp/${openId}`,
		method: 'PUT',
		data: {
			history: history
		}
	})
}
