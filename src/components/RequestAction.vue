<script setup lang="ts"></script>
<template>
  <el-button @click="$emit('replay')">replay</el-button>
  <el-button @click="$emit('copy')">copy</el-button>
  <el-button @click="$emit('diff')">diff</el-button>
</template>
