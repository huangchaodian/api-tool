<script setup lang="ts">
interface Tree {
  label: string
  children?: Tree[]
}
const defaultProps = {
  children: 'children',
  label: 'label'
}
defineProps<{
  data: Tree[]
}>()
</script>

<template>
  <div>tree</div>
  <el-tree :data="data" :props="defaultProps"></el-tree>
</template>
