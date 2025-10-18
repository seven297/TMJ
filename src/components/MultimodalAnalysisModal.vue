<template>
  <a-modal
    :visible="visible"
    :footer="false"
    :mask-closable="true"
    :closable="true"
    :width="920"
    unmount-on-close
    @cancel="emit('close')"
  >
    <template #title>
      <div class="flex items-center justify-between w-full">
        <span>{{ tool }} 多模态AI分析</span>
        <span class="text-[12px] text-gray-400 mr-[24px]">{{ timeText }}</span>
      </div>
    </template>

    <div class="bg-[#2b2b2b] text-white rounded-md">
      <!-- 图片展示区域 -->
      <div class="text-center">
        <div class="relative inline-block">
          <a-image 
            :src="currentImage.src" 
            :preview="true" 
            class="w-full max-h-[60vh] object-cover border-gray-600 hover:border-blue-400 transition-colors" 
          />
          <div class="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded">
            {{ currentImage.label }}
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  tool: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const timeText = computed(() => {
  const d = new Date()
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
})

// 根据工具类型返回对应的图片配置
const getToolImage = (toolType: string) => {
  const imageConfigs = {
    'CBCT': { src: '/src/assets/images/xray.png', label: 'CBCT三维重建' },
    'MRI': { src: '/src/assets/images/MRI.png', label: 'MRI影像' },
    'X线': { src: '/src/assets/images/xray.png', label: 'X线影像' },
    '面部照片': { src: '/src/assets/images/face.png', label: '面部照片' },
    '咬合': { src: '/src/assets/images/panoramic.jpg', label: '咬合关系' },
    '张口运动': { src: '/src/assets/images/face.png', label: '张口运动' },
    '关节音': { src: '/src/assets/images/xray.png', label: '关节音分析' }
  }
  
  return imageConfigs[toolType as keyof typeof imageConfigs] || { src: '/src/assets/images/xray.png', label: '默认图片' }
}

// 当前显示的图片
const currentImage = computed(() => {
  return getToolImage(props.tool)
})
</script>

<style lang="scss" scoped>
:deep(.arco-image-img) {
  width: 100%;
  height: 100%;
  max-height: 60vh;
}
</style>

