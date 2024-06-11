<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { nextTick, watch } from 'vue'

const props = defineProps<{
  editorId: string
  value: string
  language: string
  height: number | string
}>()
let editInstance: monaco.editor.IStandaloneCodeEditor | null = null
const getEditorValue = () => {
  return editInstance?.getModel()?.getValue()
}
defineExpose({ getEditorValue })

nextTick(() => {
  let editorDom = document.getElementById(props.editorId)
  if (editorDom !== null) {
    if (props.language === 'text') {
      editInstance = monaco.editor.create(editorDom, {
        model: monaco.editor.createModel(props.value, props.language)
      })
    } else if (props.language === 'json') {
      editInstance = monaco.editor.create(editorDom, {
        model: monaco.editor.createModel(
          JSON.stringify(JSON.parse(props.value), null, '\t'),
          props.language
        )
      })
    }
  }
})
watch(
  () => props.value,
  () => {
    if (editInstance) {
      if (props.language === 'text') {
        editInstance.setModel(monaco.editor.createModel(props.value, props.language))
      } else if (props.language === 'json') {
        editInstance.setModel(
          monaco.editor.createModel(
            JSON.stringify(JSON.parse(props.value), null, '\t'),
            props.language
          )
        )
      }
    }
  }
)
</script>
<template>
  <div
    :id="editorId"
    class="editor"
    :style="{ height: typeof height === 'number' ? height + 'px' : height }"
  ></div>
</template>

<style scoped>
.editor {
}
</style>
