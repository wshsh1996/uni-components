<script setup>
const functionList = [
	{
		name: '录音',
		path: '/pages/common/recording'
	}
]

const toFunction = (path) => {
	uni.navigateTo({
		url: path
	})
}
</script>

<template>
	<view class="main">
		<view v-for="(item, index) in functionList" :key="index" @click="toFunction(item.path)">{{
			item.name
		}}</view>
	</view>
</template>

<style scoped>
.main {
	display: flex;
	justify-content: center;
	align-items: center;
	color: red;
}
</style>
