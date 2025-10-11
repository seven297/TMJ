<template>
  <div class="main-content">
    <div class="main-row">
      <a-spin :loading="loading" tip="AI病历生成中..." dot class="w-[100%] h-[100%]">
        <!-- 实际内容 -->
        <div class="case-wrapper">
          <a-card :bordered="false" class="medical-record-card">
            <!-- 顶部导航 -->
            <div class="top-navigation">
              <div class="nav-left">
                <!-- <span class="nav-text">已生成问诊病历</span> -->
                <a-button class="return-btn" @click="onReturn"> 返回 </a-button>
              </div>
            </div>
            <!-- 主标题 -->
            <div class="main-title">
              <h1>AI问诊病历</h1>
            </div>

            <!-- 骨架屏 -->
            <SkeletonCard v-if="skeletonLoading" :section-count="5" />
            <div v-else class="scroll-content">
              <!-- 患者信息 -->
              <div class="patient-info flex items-center justify-between">
                <div class="patient-details">
                  <!-- <span class="patient-label">患者：</span> -->
                  <div class="flex flex-row gap-[24px]">
                    <span class="patient-value">{{ recordResult?.present_illness || '匿名患者' }}</span>
                    <!-- <span class="patient-gender">男性</span>
                    <span class="patient-age">16岁</span> -->
                  </div>
                </div>
                <!-- <div class="consultation-time">
                  <span class="time-label">就诊时间：</span>
                  <span class="time-value">{{ nowText }}</span>
                </div> -->
              </div>

              <!-- 病历内容区 -->
              <div class="medical-record-content">
                <div class="record-section">
                  <div class="section-label">主诉：</div>
                  <div class="section-content">{{ recordResult?.chief_complaint || '无' }}</div>
                </div>

                <div class="record-section">
                  <div class="section-label">现病史：</div>
                  <div class="section-content">
                    {{ recordResult?.present_illness || '无' }}
                  </div>
                </div>

                <div class="record-section">
                  <div class="section-label">既往史：</div>
                  <div class="section-content">{{ recordResult?.past_medical_history || '无' }}</div>
                </div>

                <div class="record-section">
                  <div class="section-label">过敏史：</div>
                  <div class="section-content">{{ recordResult?.allergy_history || '无' }}</div>
                </div>

                <div class="record-section">
                  <div class="section-label">家族史：</div>
                  <div class="section-content">{{ recordResult?.family_history || '无' }}</div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <a-button class="action-btn secondary-btn" @click="onRefresh">
                <template #icon><icon-refresh /></template>
                重新生成
              </a-button>
              <a-button
                class="action-btn primary-btn"
                type="primary"
                @click="onAdopt"
              >
                <template #icon><icon-bulb /></template>
                采纳病历
              </a-button>
            </div>
          </a-card>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconRefresh, IconBulb } from "@arco-design/web-vue/es/icon";
import { useChatStore } from "@/stores/chat";
import { http } from "@/services/http";

interface RecordResponse {
  allergy_history: string;
  chief_complaint: string;
  family_history: string;
  past_medical_history: string;
  present_illness: string;
}

const router = useRouter();
const chatStore = useChatStore();

// 从全局 store 读取 sessionId 与 messages
const sessionId = computed(() => chatStore.sessionId);
const messages = computed(() => chatStore.messages);

const nowText = ref(formatNow());

// 页面加载状态
const loading = ref(false);
const skeletonLoading = ref(true);

// 诊断结果
const recordResult = ref<RecordResponse>();

function formatNow() {
  const d = new Date();
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(
    d.getHours()
  )}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// 获取诊断结果
async function getDiagnosisResult(isRefresh = false) {
  try {
    loading.value = true;
    const payload = {
      conversation: messages.value.slice(1).map((x) => ({
        role: x.role === "user" ? "user" : "assistant",
        content: x.content,
      })),
      session_id: sessionId.value,
    };
    const response = await http.post<{
      chief_complaint: RecordResponse;
    }>("/chat-diagnosis", payload, { showErrorMessage: true });
    
    // 处理返回的诊断结果
    const responseData =
      response && "data" in response ? response.data : response;
    if (responseData) {
      recordResult.value = responseData.chief_complaint;
      // 这里可以根据实际 API 返回的数据结构来更新页面内容
      skeletonLoading.value = false;
    }

    if (isRefresh) {
      Message.success("病历已重新生成");
    }
  } catch (err) {
    // 错误提示在 http 封装已处理（当 showErrorMessage 为 true）
  } finally {
    loading.value = false;
  }
}

// 进入页面模拟加载过程
onMounted(() => {
  getDiagnosisResult();
});

function onRefresh() {
  loading.value = true;
  nowText.value = formatNow();

  getDiagnosisResult(true);
}

function onReturn() {
  // router.back();
  // 返回时保持当前会话状态，不刷新页面
  router.push({ name: "effect" });
}

function onAdopt() {
  // 可使用 messages.value 生成结构化病历内容后提交
  Message.success("病历已录入医生工作站");
}
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.main-content {
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
}

/* 顶部导航 */
.top-navigation {
  margin-bottom: 16px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-text {
  font-size: 16px;
  font-weight: 500;
  color: #1e40af;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #3b82f6;
  }
}

.return-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
    color: #475569;
  }
}

.main-row {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  // min-height: calc(100vh - 40px);
  margin: 0 auto;
  // padding: 24px;
  position: relative;
  z-index: 1;
}

.case-wrapper {
  width: 100%;
  height: 100%;
}

/* 病历卡片样式 */
.medical-record-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(59, 130, 246, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
  }

  :deep(.arco-card-body) {
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
  }
}

/* 主标题 */
.main-title {
  text-align: center;
  margin-bottom: 40px;
  position: relative;

  h1 {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #8b5cf6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: 0.5px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 2px;
    }
  }
}

/* 患者信息 */
.patient-info {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 
    0 4px 12px rgba(59, 130, 246, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

.patient-details {
  display: flex;
  align-items: center;
  // gap: 16px;
  // margin-bottom: 12px;
  flex-wrap: wrap;
}

.patient-label {
  font-weight: 500;
  color: #475569;
  font-size: 16px;
}

.patient-value {
  font-weight: 600;
  color: #1e40af;
  font-size: 16px;
}

.patient-gender,
.patient-age {
  font-weight: 500;
  color: #64748b;
  font-size: 16px;
}

.consultation-time {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label {
  font-weight: 500;
  color: #475569;
  font-size: 14px;
}

.time-value {
  font-weight: 600;
  color: #1e40af;
  font-size: 14px;
}

/* 病历内容 */
.medical-record-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 
    0 8px 20px rgba(59, 130, 246, 0.05),
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
  box-shadow: 
    0 2px 8px rgba(59, 130, 246, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 12px rgba(59, 130, 246, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.action-btn {
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.secondary-btn {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #64748b;
    backdrop-filter: blur(10px);
    box-shadow: 
      0 4px 12px rgba(59, 130, 246, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
      border-color: #3b82f6;
      color: #1e40af;
      transform: translateY(-2px);
      box-shadow: 
        0 8px 20px rgba(59, 130, 246, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
  }

  &.primary-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border: none;
    color: white;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
  }
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

  .main-title h1 {
    font-size: 24px;
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

  .action-btn {
    width: 100%;
  }
}
</style>
