<template>
	<view>
		<view :class="['mic-layer', { 'mic-layer-talking': state.isTalking }]">
			<!-- 按钮样式 -->
			<view
				:class="state.isTalking ? 'mic-btn-talking' : 'mic-btn'"
				@touchstart="touchStart"
				@touchend="onEnd"
				@longpress="onStart"
				@touchmove="handleRecordMove"
			>
				<view v-show="!state.isTalking" class="record-button">
					<text class="">按住说话</text>
				</view>
				<view v-show="state.isTalking" class="mic-btn-talking_text">说话中...</view>
				<view v-show="state.isTalking && !state.sendLock" class="tip-text"
					><text class="mr-10">松开</text>发送</view
				>
			</view>
			<!-- 语音音阶动画 -->
			<view v-if="state.isTalking" :class="['record-animate-box', { active: state.sendLock }]">
				<view class="voice-scale">
					<view class="item" v-for="(item, index) in 10" :key="index"></view>
				</view>
			</view>
			<!-- 取消发送 -->
			<view v-if="state.isTalking" :class="['record-cancel', { active: state.sendLock }]">
				<!-- ⬇️可换成自己的icon -->
				<text class="close-icon">x</text>
				<!-- ⬆️️可换成自己的icon -->
				<view class="tip-text" v-show="state.sendLock"><text class="mr-10">松开</text>取消</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const record = uni.getRecorderManager()
const state = reactive({
	isTalking: false, // 是否正在讲话
	sendLock: false, // 语音是否发送锁，true-不发送，false-发送（用于上滑取消发送）
	// record: null, // 语音对象
	startPoint: {} //记录长按录音开始点信息,用于后面计算滑动距离。
})

/**
 * 开始录音
 */
const onStart = () => {
	const option = {
		format: 'mp3'
	}
	console.log('start')
	state.isTalking = true
	// uni.vibrateShort() // 震动
	record.start(option)
	record.onStart((res) => {
		console.log('start', res)
	})
	record.onError((res) => {
		console.log('录音错误事件：', res)
	})
}

/**
 * 结束录音
 */
const onEnd = () => {
	state.isTalking = false
	record.stop()
	record.onStop((res) => {
		console.log(res, '录音回调地址')
		if (state.sendLock) {
			state.sendLock = false // 恢复锁状态
			console.log('取消发送')
			return
		} // 取消发送
		if (res.duration < 1000) {
			uni.showToast({
				icon: 'error',
				title: '说话时间太短'
			})
			return
		}
		// TODO
		// ***
	})
}

/**
 * 开始触屏
 * @param {Object} e
 */
const touchStart = (e) => {
	state.startPoint.clientX = e.changedTouches[0].clientX //手指按下时的X坐标
	state.startPoint.clientY = e.changedTouches[0].clientY //手指按下时的Y坐标
}

/**
 * 录音时手指滑动
 * @param {Object} e
 */
const handleRecordMove = (e) => {
	let touchData = e.touches[0] //滑动过程中，手指滑动的坐标信息
	let moveX = touchData.clientX - state.startPoint.clientX
	let moveY = touchData.clientY - state.startPoint.clientY
	if (moveY > -45) {
		// 滑动距离不够则不取消发送
		state.sendLock = false
	} else {
		state.sendLock = true
	}
}

onLoad(() => {
	// state.record = uni.getRecorderManager()
})
</script>

<style lang="scss">
.mr-10 {
	margin-right: 10rpx;
}
.mic-layer {
	position: fixed;
	bottom: 20rpx;
	width: 100%;
	box-sizing: border-box;
	.record-button {
		border-radius: 40rpx;
		background-color: #2878f4;
		color: #ffffff;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}
}
/* 讲话中样式 */
.mic-layer-talking {
	position: fixed;
	width: 100vw;
	height: 100vh;
	left: 0;
	top: 0;
	background-color: rgba(0, 0, 0, 0.6);
	.mic-btn-talking {
		position: absolute;
		bottom: 0;
		width: 100vw;
		height: 200rpx;
		border-radius: 80px 80px 0 0;
		background-color: #f2f2f2;
		&_text {
			color: #999999;
			padding: 60rpx 0;
			text-align: center;
		}
	}
	/* 发送、取消提示文字 */
	.tip-text {
		position: absolute;
		top: -60rpx;
		left: 50%;
		width: 160rpx;
		text-align: center;
		transform: translateX(-50%);
		color: #e3e4ea;
		font-size: 24rpx;
	}
	/* 上方语音动画 */
	.record-animate-box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 300rpx;
		height: 140rpx;
		background-color: #2878f4;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
		&.active {
			background-color: #f56c6c;
			width: 140rpx;
		}
		/* 语音音阶 */
		.voice-scale {
			width: 60%;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.item {
				display: block;
				background: #333333;
				width: 4rpx;
				height: 10%;
				margin-right: 2.5px;
				float: left;
				&:last-child {
					margin-right: 0px;
				}
				&:nth-child(1) {
					animation: load 1s 0.8s infinite linear;
				}

				&:nth-child(2) {
					animation: load 1s 0.6s infinite linear;
				}

				&:nth-child(3) {
					animation: load 1s 0.4s infinite linear;
				}

				&:nth-child(4) {
					animation: load 1s 0.2s infinite linear;
				}

				&:nth-child(5) {
					animation: load 1s 0s infinite linear;
				}

				&:nth-child(6) {
					animation: load 1s 0.2s infinite linear;
				}

				&:nth-child(7) {
					animation: load 1s 0.4s infinite linear;
				}

				&:nth-child(8) {
					animation: load 1s 0.6s infinite linear;
				}

				&:nth-child(9) {
					animation: load 1s 0.8s infinite linear;
				}

				&:nth-child(10) {
					animation: load 1s 1s infinite linear;
				}
			}
		}

		@keyframes load {
			0% {
				height: 10%;
			}

			50% {
				height: 100%;
			}

			100% {
				height: 10%;
			}
		}
	}
	/* 取消按钮 */
	.record-cancel {
		position: absolute;
		left: 50%;
		bottom: 300rpx;
		transform: translateX(-50%);
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.2);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.3s;
		&.active {
			transform: translateX(-50%) scale(1.2);
			background-color: #f56c6c;
		}
		.close-icon {
			font-size: 40rpx;
			color: #ffffff;
		}
	}
}
</style>
