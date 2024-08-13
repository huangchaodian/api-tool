<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { type MyTree } from '@/core/request'
interface _Node {
  expanded: boolean
  childNodes: _Node[]
}
const defaultProps = {
  children: 'children',
  label: 'label'
}
defineProps<{
  data: MyTree[]
  selected: number
  copied: number
}>()
const emit = defineEmits(['request-click'])
const handleNodeClick = (data: MyTree) => {
  if (data.id !== undefined) {
    emit('request-click', data.id)
  }
}
const myElTree = ref()
const defaultExpendKeys = ref<number[]>([])
const getExtendNode = (data: object, node: _Node) => {
  nextTick(() => {
    while (node.expanded && node.childNodes && node.childNodes.length === 1) {
      node = node.childNodes[0]
      node.expanded = true
    }
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
  >
    <template v-slot="{ node, data }">
      <span class="custom-tree-node">
        <span
          style="color: blue; font-size: 12px; position: relative; top: -2px"
          v-if="data.typ === 'host'"
        >
          ⌖
        </span>
        <span style="color: #a2e701" v-if="data.id === selected"> > </span>
        <span style="color: #e51c02" v-if="data.id === copied"> > </span>
        <span>{{ node.label }}</span>
      </span>
    </template>
  </el-tree>
</template>
