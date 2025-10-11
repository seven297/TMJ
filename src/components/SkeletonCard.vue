<template>
  <!-- 患者信息骨架 -->
  <div class="patient-info">
    <div class="patient-details">
      <div class="skeleton-text skeleton-label"></div>
      <div class="flex flex-row gap-[24px]">
        <div class="skeleton-text skeleton-value"></div>
        <div class="skeleton-text skeleton-gender"></div>
        <div class="skeleton-text skeleton-age"></div>
      </div>
    </div>
    <div class="consultation-time">
      <div class="skeleton-text skeleton-time-label"></div>
      <div class="skeleton-text skeleton-time-value"></div>
    </div>
  </div>

  <!-- 病历内容骨架 -->
  <div class="medical-record-content">
    <div class="record-section" v-for="n in sectionCount" :key="n">
      <div class="section-label">
        <div class="skeleton-text skeleton-section-label"></div>
      </div>
      <div class="section-content">
        <div class="skeleton-text skeleton-section-content"></div>
        <div
          class="skeleton-text skeleton-section-content-short"
          v-if="n === 2"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  sectionCount?: number;
}

withDefaults(defineProps<Props>(), {
  sectionCount: 5,
});

// 确保组件被正确导出
defineOptions({
  name: "SkeletonCard",
});
</script>

<style lang="scss" scoped>
/* 患者信息 */
.patient-info {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.patient-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.consultation-time {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 病历内容 */
.medical-record-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

.record-section {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-label {
  font-weight: 600;
  color: #1e40af;
  text-align: end;
  font-size: 16px;
  min-width: 80px;
  flex-shrink: 0;
  margin-right: 16px;
  margin-top: 10px;
}

.section-content {
  flex: 1;
  color: #374151;
  font-size: 16px;
  line-height: 1.6;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

/* 骨架屏动画 */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* 骨架屏基础样式 */
.skeleton-text,
.skeleton-button {
  background: linear-gradient(90deg, #f0f0f0 25%, #f0f0f0 75%);
  background-size: 200px 100%;
  // animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* 标题骨架 */
.skeleton-title {
  width: 300px;
  height: 40px;
  margin: 0 auto;
  border-radius: 8px;
}

/* 按钮骨架 */
.skeleton-button {
  width: 80px;
  height: 32px;
  border-radius: 8px;
}

.skeleton-action-btn {
  width: 120px;
  height: 40px;
  border-radius: 12px;

  &.primary {
    background: linear-gradient(90deg, #e0e7ff 25%, #c7d2fe 50%, #e0e7ff 75%);
  }
}

/* 文本骨架 */
.skeleton-label {
  width: 60px;
  height: 16px;
  margin-right: 8px;
}

.skeleton-value {
  width: 80px;
  height: 16px;
}

.skeleton-gender {
  width: 40px;
  height: 16px;
}

.skeleton-age {
  width: 50px;
  height: 16px;
}

.skeleton-time-label {
  width: 80px;
  height: 14px;
}

.skeleton-time-value {
  width: 120px;
  height: 14px;
}

.skeleton-section-label {
  width: 60px;
  height: 16px;
}

.skeleton-section-content {
  width: 100%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-section-content-short {
  width: 70%;
  height: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-row {
    padding: 16px;
  }

  .medical-record-card {
    :deep(.arco-card-body) {
      padding: 20px;
    }
  }

  .skeleton-title {
    width: 240px;
    height: 32px;
  }

  .patient-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .record-section {
    flex-direction: column;
    gap: 8px;
  }

  .section-label {
    min-width: auto;
    margin-right: 0;
  }

  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-action-btn {
    width: 100%;
  }
}
</style>
