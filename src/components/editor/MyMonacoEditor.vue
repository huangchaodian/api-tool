<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { nextTick } from 'vue'

const props = defineProps<{
  editorId: string
  value: string
  language: string
  height: number
}>()
nextTick(() => {
  let editorDom = document.getElementById(props.editorId)
  if (editorDom !== null) {
    console.log(props)
    if (props.language === 'text') {
      monaco.editor.create(editorDom, {
        model: monaco.editor.createModel(props.value, props.language)
      })
    } else if (props.language === 'json') {
      monaco.editor.create(editorDom, {
        model: monaco.editor.createModel(
          JSON.stringify(JSON.parse(props.value), null, '\t'),
          props.language
        )
      })
    }
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
