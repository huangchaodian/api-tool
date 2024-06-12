<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { nextTick, watch } from 'vue'

const props = defineProps<{
  editorId: string
  text: string
  language: string
  height: number | string
}>()
let editInstance: monaco.editor.IStandaloneCodeEditor | null = null
const getEditorValue = () => {
  return editInstance?.getModel()?.getValue()
}
defineExpose({ getEditorValue })

const getJsonModel = (data: string) => {
  try {
    return monaco.editor.createModel(JSON.stringify(JSON.parse(data), null, '\t'), 'json')
  } catch (e) {
    console.log(e)
  }
  return monaco.editor.createModel(data, 'text')
}
nextTick(() => {
  let editorDom = document.getElementById(props.editorId)
  if (editorDom !== null) {
    if (props.language === 'text') {
      editInstance = monaco.editor.create(editorDom, {
        model: monaco.editor.createModel(props.text, props.language)
      })
    } else if (props.language === 'json') {
      editInstance = monaco.editor.create(editorDom, {
        model: getJsonModel(props.text)
      })
    }
  }
})
watch(
  () => props.text,
  () => {
    if (editInstance) {
      if (props.language === 'text') {
        editInstance.setModel(monaco.editor.createModel(props.text, props.language))
      } else if (props.language === 'json') {
        editInstance.setModel(getJsonModel(props.text))
      }
    }
  }
)
</script>
<template>
  <div
    :id="editorId"
    :style="{ height: typeof height === 'number' ? height + 'px' : height }"
  ></div>
</template>
