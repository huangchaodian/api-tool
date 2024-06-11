<script setup lang="ts">
const defaultProps = {
  children: 'children',
  label: 'label'
}
defineProps<{
  data: Tree[]
}>()
const emit = defineEmits(['request-click'])
const handleNodeClick = (data: Tree) => {
  if (data.id) {
    emit('request-click', data.id)
  }
}
</script>

<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
</template>
