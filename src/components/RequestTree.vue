<script setup lang="ts">
const defaultProps = {
  children: 'children',
  label: 'label'
}
defineProps<{
  data: MyTree[]
}>()
const emit = defineEmits(['request-click'])
const handleNodeClick = (data: MyTree) => {
  if (data.id) {
    emit('request-click', data.id)
  }
}
</script>

<template>
  <el-tree
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
    default-expand-all
  ></el-tree>
</template>
