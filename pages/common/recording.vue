<template>
	<view class="sound-recording">
		<view class="time"
			>{{ state.status == 0 ? '录音时长' : state.status == 3 ? '录音已完成' : '正在录音中' }}：{{
				state.time
			}}
			秒</view
		>
		<view class="btn">
			<view :class="state.status == 3 ? 'show' : 'hide'" @click="reset" hover-class="jump-hover"
				>重新录制</view
			>
			<view
				:class="state.status == 3 && state.playStatus == 0 ? 'show' : 'hide'"
				@click="bofang"
				hover-class="jump-hover"
			>
				{{ state.playStatus == 1 ? '录音播放中' : '播放录音' }}
			</view>
		</view>
		<view class="progress">
			<text class="txt"
				>最大录音时长（{{ state.duration / 1000 }}秒 = {{ state.duration / 60000 }}分钟）</text
			>
			<progress
				:percent="state.time * (100 / (duration / 1000))"
				border-radius="10"
				color="green"
				stroke-width="10"
				backgroundColor="#fff"
			/>
		</view>
		<view class="anniu">
			<view
				:class="state.status == 0 ? 'row' : 'no-clicking'"
				@click="kaishi"
				hover-class="jump-hover"
				>开始</view
			>
			<view
				:class="state.status == 1 ? 'row' : 'no-clicking'"
				@click="zanting"
				hover-class="jump-hover"
				>暂停</view
			>
			<view
				:class="state.status == 2 ? 'row' : 'no-clicking'"
				@click="jixu"
				hover-class="jump-hover"
				>继续</view
			>
			<view
				:class="state.status == 1 || state.status == 2 ? 'row' : 'no-clicking'"
				@click="tingzhi"
				hover-class="jump-hover"
				>停止</view
			>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue'
let recorderManager = uni.getRecorderManager()
const innerAudioContext = uni.createInnerAudioContext()
let init

const state = reactive({
	time: 0, //录音时长
	duration: 600000, //录音最大值ms 600000/10分钟
	tempFilePath: '', //音频路径
	status: 0, //录音状态 0:未开始录音 1:正在录音 2:暂停录音 3:已完成录音
	playStatus: 0 //录音播放状态 0:未播放 1:正在播放 2:暂停播放
})

// 开始录音
const kaishi = () => {
	clearInterval(init) //清除定时器
	//监听录音自动结束事件(如果不加，录音时间到最大值自动结束后，没获取到录音路径将无法正常进行播放)
	recorderManager.onStop((res) => {
		console.log('recorder stop', res)
		state.tempFilePath = res.tempFilePath
		state.status = 3
		recordingTimer(state.time)
	})

	const options = {
		duration: state.duration, //指定录音的时长，单位 ms
		sampleRate: 16000, //采样率
		numberOfChannels: 1, //录音通道数
		encodeBitRate: 96000, //编码码率
		format: 'mp3', //音频格式，有效值 aac/mp3
		frameSize: 10 //指定帧大小，单位 KB
	}
	recordingTimer()
	recorderManager.start(options)
	// 监听音频开始事件
	recorderManager.onStart((res) => {
		state.status = 1
		console.log('recorder start', res)
		console.log(state.status, 'status')
	})
}

/**
 * 暂停录音
 */
const zanting = () => {
	console.log('zanting')
	recorderManager.onPause(() => {
		console.log('recorder pause')
		state.status = 2
	})
	recordingTimer(state.time)
	recorderManager.pause()
}

/**
 * 继续录音
 */
const jixu = () => {
	state.status = 1
	recordingTimer()
	recorderManager.resume()
}

/**
 * 停止录音
 */
const tingzhi = () => {
	recorderManager.onStop((res) => {
		console.log('recorder stop', res)
		state.tempFilePath = res.tempFilePath
		state.status = 3
	})
	recordingTimer(state.time)
	recorderManager.stop()
}

/**
 * 播放录音
 */
const bofang = () => {
	//音频地址
	console.log(state.tempFilePath)
	innerAudioContext.src = state.tempFilePath
	//在ios下静音时播放没有声音，默认为true，改为false就好了。
	// innerAudioContext.obeyMuteSwitch = false

	//点击播放
	if (state.playStatus == 0) {
		state.playStatus = 1
		innerAudioContext.play()
	}
	// //播放结束
	innerAudioContext.onEnded(() => {
		innerAudioContext.stop()
		state.playStatus = 0
	})
}

/**
 * 计时
 */
const recordingTimer = (time) => {
	if (time == undefined) {
		//将计时器赋值给init
		init = setInterval(() => {
			state.time = state.time + 1
		}, 1000)
		console.log(init, 'init')
	} else {
		clearInterval(init)
		console.log('暂停计时')
	}
}

/**
 * 重新录制
 */
const reset = () => {
	uni.showModal({
		title: '重新录音',
		content: '是否重新录制?',
		success(res) {
			if (res.confirm) {
				state.time = 0
				state.tempFilePath = ''
				state.status = 0
				state.playStatus = 0
				innerAudioContext.stop()
			}
		}
	})
}
</script>

<style>
.sound-recording {
	background-color: rgb(234, 234, 234);
	margin: 10rpx 30rpx;
	border-radius: 20rpx;
	padding: 5rpx 0rpx;
}

.btn {
	margin: 0rpx 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.btn .show {
	padding: 10rpx;
	width: 200rpx;
	font-size: 25rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgb(178, 228, 228);
	border-radius: 20rpx;
	border: 5rpx solid rgb(127, 204, 214);
}

.btn .hide {
	padding: 10rpx;
	width: 200rpx;
	font-size: 25rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20rpx;
	border: 5rpx solid #eee;
	pointer-events: none;
	background-color: rgba(167, 162, 162, 0.445);
}

.time {
	line-height: 70rpx;
	text-align: center;
	font-size: 30rpx;
}

.progress {
	margin: 20rpx;
}

.play {
	margin: 0rpx 20rpx;
}

.txt {
	display: flex;
	justify-content: center;
	line-height: 60rpx;
	font-size: 25rpx;
}

.anniu {
	margin: 10rpx 50rpx;
	display: flex;
	justify-content: space-between;
}

.row {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	font-size: 25rpx;
	width: 80rpx;
	height: 80rpx;
	background-color: rgb(178, 228, 228);
	border: 5rpx solid rgb(127, 204, 214);
}

.jump-hover {
	transform: scale(0.9);
}

/*禁止点击*/

.anniu .no-clicking {
	pointer-events: none;
	background-color: rgba(167, 162, 162, 0.445);
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	font-size: 25rpx;
	width: 80rpx;
	height: 80rpx;
	border: 5rpx solid rgb(241, 244, 245);
}
</style>
