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

    <div class="bg-[#2b2b2b] text-white rounded-md p-4">
      <div class="grid grid-cols-12 gap-4">
        <!-- 预览区 -->
        <div class="col-span-5 space-y-4">
          <div class="bg-black/30 rounded-md p-2">
            <div class="text-[12px] text-gray-300 mb-2">侧位片</div>
            <a-image :src="preview1" :preview="false" class="w-full h-[160px] object-cover rounded" />
          </div>
          <div class="bg-black/30 rounded-md p-2">
            <div class="text-[12px] text-gray-300 mb-2">全景片</div>
            <a-image :src="preview2" :preview="false" class="w-full h-[160px] object-cover rounded" />
          </div>
        </div>

        <!-- 指标表 -->
        <div class="col-span-7">
          <a-table
            :data="rows"
            :pagination="false"
            :bordered="false"
            :scroll="{ y: 340 }"
            size="small"
            row-key="key"
            class="bg-transparent"
          >
            <a-table-column title="测量项目" data-index="name" />
            <a-table-column title="标准值" data-index="std" />
            <a-table-column title="标准差" data-index="stddev" />
            <a-table-column title="测量值">
              <template #cell="{ record }">
                <span :class="record.type === 'alert' ? 'text-red-400' : 'text-green-400'">{{ record.value }}</span>
              </template>
            </a-table-column>
            <a-table-column title="测量结果提示">
              <template #cell="{ record }">
                <span :class="record.type === 'alert' ? 'text-red-400' : 'text-green-400'">{{ record.tip }}</span>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import xrayImage from '@/assets/images/xray.png'
import panoramicImage from '@/assets/images/panoramic.jpg'

defineProps<{
  visible: boolean
  tool: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const timeText = computed(() => {
  const d = new Date()
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
})

// 示例图片（可替换为真实数据）
const preview1 = panoramicImage
const preview2 = xrayImage


type Row = { key: string; name: string; std: string | number; stddev: string | number; value: string | number; type: 'ok' | 'alert'; tip: string }
const rows: Row[] = [
  { key: 'SNA', name: 'SNA', std: 82.0, stddev: 4.1, value: 81.7, type: 'ok', tip: '上颌前后位置正常' },
  { key: 'SNB', name: 'SNB', std: 80.1, stddev: 3.5, value: 90.7, type: 'alert', tip: '下颌过度前突' },
  { key: 'ANB', name: 'ANB', std: 2.3, stddev: 1.6, value: -9.1, type: 'alert', tip: '骨性Ⅲ类' },
  { key: 'FMA', name: 'FMA(FH-MP)', std: 27.3, stddev: 6.1, value: 25.7, type: 'ok', tip: '下颌角接近正常' },
  { key: 'Wits', name: 'Witsmhm', std: 0, stddev: 2, value: -4.2, type: 'alert', tip: '骨性Ⅲ类倾向' },
]
</script>

<style lang="scss" scoped>
:deep(.arco-image-img) {
  width: 100%;
  height: 100%;
}
</style>

