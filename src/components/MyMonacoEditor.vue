<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { nextTick } from 'vue'

const props = defineProps<{
  editorId: string
  value: string
  language: string
  height: number
}>()
console.log(props)

nextTick(() => {
  let editorDom = document.getElementById(props.editorId)
  if (editorDom !== null) {
    monaco.editor.create(editorDom, {
      value: props.value,
      language: props.language
    })
  }
})
</script>
<template>
  <div :id="editorId" class="editor" :style="{ height: height + 'px' }"></div>
</template>

<style scoped>
.editor {
}
</style>
