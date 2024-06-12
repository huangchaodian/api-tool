<script setup lang="ts">
import { ref, nextTick } from 'vue'
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
const myElTree = ref()
const defaultExpendKeys = ref<number[]>([])
const getExtendNode = () => {
  nextTick(() => {
    let nodes = myElTree.value.store._getAllNodes()
    let extended: number[] = []
    nodes.forEach(
      (node: { expanded: any; data: { _seq: number } }) =>
        node.expanded && extended.push(node.data._seq)
    )
    defaultExpendKeys.value = extended
  })
}
</script>

<template>
  <el-tree
    ref="myElTree"
    :data="data"
    :props="defaultProps"
    node-key="_seq"
    @node-click="handleNodeClick"
    @node-expand="getExtendNode"
    @node-collapse="getExtendNode"
    :default-expanded-keys="defaultExpendKeys"
    :auto-expand-parent="false"
  ></el-tree>
</template>
