<script setup lang="ts">
defineProps<{
  disableReplay: boolean
}>()
</script>
<template>
  <el-button :disabled="disableReplay" @click="$emit('replay')">replay</el-button>
  <el-button @click="$emit('copy')">copy</el-button>
  <el-button @click="$emit('diff')">diff</el-button>
  <el-button @click="$emit('clear')">clear</el-button>
</template>
