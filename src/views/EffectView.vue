<template>
  <div class="main-content">
    <a-row :gutter="24" class="main-row">
      <!-- 左侧导航（业务） -->
      <a-col :span="6" class="h-[100%]">
        <a-card :bordered="false" class="sidebar-card">
          <template #title>
            <div class="sidebar-title">
              <div class="title-icon">
                <img src="@/assets/icons/microscope.png" class="emoji-16px" />
              </div>
              <span class="title-text">多模态AI分析工具</span>
            </div>
          </template>
          <a-list :bordered="false" size="small" class="analysis-list">
            <a-list-item class="analysis-item" @click="openModal('CBCT')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/bar_chart.png" class="emoji-16px" />
                </div>
                <span>CBCT</span>
              </div>
            </a-list-item>
            <a-list-item class="analysis-item" @click="openModal('MRI')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/brain.png" class="emoji-16px" />
                </div>
                <span>MRI</span>
              </div>
            </a-list-item>
            <a-list-item class="analysis-item" @click="openModal('X线')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/x-ray.png" class="emoji-16px" />
                </div>
                <span>X线</span>
              </div>
            </a-list-item>
            <a-list-item class="analysis-item" @click="openModal('面部照片')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/camera_with_flash.png" class="emoji-16px" />
                </div>
                <span>面部照片</span>
              </div>
            </a-list-item>
            <a-list-item class="analysis-item" @click="openModal('咬合')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/tooth.png" class="emoji-16px" />
                </div>
                <span>咬合</span>
              </div>
            </a-list-item>
            <a-list-item class="analysis-item" @click="openModal('张口运动')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/speaking_head_in_silhouette.png" class="emoji-16px" />
                </div>
                <span>张口运动</span>
              </div>
            </a-list-item>
            <a-list-item class="analysis-item" @click="openModal('关节音')">
              <div class="item-content">
                <div class="item-icon">
                  <img src="@/assets/icons/loud_sound.png" class="emoji-16px" />
                </div>
                <span>关节音</span>
              </div>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>

      <!-- 右侧对话区（业务） -->
      <a-col :span="18" class="h-[100%]">
        <a-card :bordered="false" class="chat-card">
          <div class="chat-header">
            <div class="header-icon">
              <img src="@/assets/icons/speech_balloon.png" class="emoji-22px" />
            </div>
            <span class="header-title">初步问诊</span>
            <div class="header-status">
              <div class="status-dot"></div>
              <span>在线</span>
            </div>
          </div>

          <!-- 聊天记录区 -->
          <div ref="scrollEl" class="chat-container">
            <template v-for="(m, idx) in messages" :key="m.id">
              <!-- 机器人消息（除欢迎语外显示时间） -->
              <template v-if="m.role === 'bot'">
                <div v-if="idx > 0" class="text-[12px] text-gray-400 ml-14">
                  {{ formatTime(m.createdAt) }}
                </div>
                <div class="message-wrapper bot-message">
                  <div class="ai-avatar">
                    <!-- <div class="ai-avatar-icon">Ai</div> -->
                    <div class="ai-avatar-icon">
                      <img alt="avatar" src="@/assets/images/ai-avatar.png" class="rounded-[8px]" />
                    </div>
                  </div>
                  <div class="message-bubble bot-bubble" v-html="m.content"></div>
                </div>
                <div v-if="m.status === 'failed' || m.status === 'timeout'" class="text-[12px] text-red-500 ml-14 mt-1">
                  {{ m.status === "timeout" ? "AI 回复超时" : "AI 回复失败" }}
                  <a-link class="ml-2" @click="retryBot(m)" :disabled="isResponding">重新生成</a-link>
                </div>
                <div v-if="idx > 0" class="ml-14 mt-2 flex items-center gap-6 select-none">
                  <button class="flex items-center gap-1 text-[12px] transition-colors" :class="m.feedback === 'like'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                    " @click="setFeedback(m, 'like')">
                    <icon-thumb-up />
                    <span>满意</span>
                  </button>
                  <button class="flex items-center gap-1 text-[12px] transition-colors" :class="m.feedback === 'dislike'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                    " @click="setFeedback(m, 'dislike')">
                    <icon-thumb-down />
                    <span>不满意</span>
                  </button>
                </div>
              </template>
              <!-- 用户消息 -->
              <div v-else class="user-message-wrapper">
                <div class="message-time user-time">
                  {{ formatTime(m.createdAt) }}
                </div>
                <div class="message-wrapper user-message">
                  <div class="message-bubble user-bubble" v-text="m.content"></div>
                  <div class="user-avatar">
                    <!-- <div class="user-avatar-icon">👤</div> -->
                    <div class="user-avatar-icon">
                      <img alt="avatar" src="@/assets/images/user-avatar.png" class="rounded-[8px]" />
                    </div>
                  </div>
                </div>
                <div class="text-[12px] text-right mr-14 mt-1" :class="{
                  'text-gray-400': m.status === 'sending',
                  'text-green-500': m.status === 'success',
                  'text-red-500':
                    m.status === 'failed' || m.status === 'timeout',
                }">
                  <template v-if="m.status === 'sending'">发送中…</template>
                  <template v-else-if="m.status === 'success'">已发送</template>
                  <template v-else-if="m.status === 'failed'">发送失败</template>
                  <template v-else-if="m.status === 'timeout'">发送超时</template>
                  <a-link v-if="m.status === 'failed' || m.status === 'timeout'" class="ml-2"
                    @click="retryUser(m)">重新发送</a-link>
                </div>
              </div>
            </template>
            <!-- 正在回复指示 -->
            <div v-if="isResponding" class="message-wrapper bot-message typing">
              <div class="ai-avatar">
                <!-- <div class="ai-avatar-icon">V</div> -->
                <div class="ai-avatar-icon">
                  <img alt="avatar" src="@/assets/images/ai-avatar.png" class="rounded-[8px]" />
                </div>
              </div>
              <div class="message-bubble bot-bubble typing-bubble">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="typing-text">正在生成回复...</span>
              </div>
            </div>
          </div>

          <div class="action-container">
            <!-- 操作按钮 -->
            <div v-if="messages[messages.length - 1]?.is_finished" class="action-buttons">
              <a-button class="action-btn secondary-btn" :disabled="isResponding" @click="restartConsultation">
                <template #icon><icon-refresh /></template>
                重新问诊
              </a-button>
              <a-button class="action-btn secondary-btn" :disabled="isResponding" @click="goCase">
                <template #icon><icon-file /></template>
                AI病历生成
              </a-button>
              <a-button class="action-btn primary-btn" :loading="isResponding" @click="goDiagnosis">
                <template #icon><icon-robot /></template>
                AI诊断分析
              </a-button>
            </div>

            <!-- 输入框 -->
            <div class="input-container">
              <div class="input-wrapper">
                <a-textarea v-model="inputText" class="message-input" :auto-size="{ minRows: 3, maxRows: 6 }"
                  placeholder="请描述您的问题，Enter发送（Shift+Enter换行）" @keydown.enter.prevent="onEnter" />
                <div class="input-actions">
                  <a-button class="send-button" type="primary" :disabled="!canSend" :loading="isResponding"
                    @click="onSend">
                    <template #icon><icon-send /></template>
                    发送
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>

  <MultimodalAnalysisModal :visible="modalVisible" :tool="activeTool" @close="modalVisible = false" />
</template>

<script setup lang="ts">
/**
 * 效果演示页面（主体内容）。
 * - 使用全局注册的 DefaultLayout 提供顶部栏与左侧工具导航
 */
import { ref, nextTick, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { defineAsyncComponent } from "vue";
const MultimodalAnalysisModal = defineAsyncComponent(
  () => import("../components/MultimodalAnalysisModal.vue")
);
import {
  IconThumbUp,
  IconThumbDown,
  IconRefresh,
  IconFile,
  IconRobot,
  IconSend,
} from "@arco-design/web-vue/es/icon";
import { http } from "@/services/http";
import { useChatStore } from "@/stores/chat";

type Role = "bot" | "user";
type MessageStatus = "success" | "sending" | "failed" | "timeout";
type Feedback = "like" | "dislike" | null;

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status: MessageStatus;
  feedback?: Feedback;
  is_finished?: boolean;
}

// AI聊天接口响应类型
interface AiChatResponse {
  is_finished?: boolean;
  next_question?: string;
}

const sessionId = ref("tmj-aibot-001");

const now = Date.now();
// 默认欢迎消息
const defaultWelcomeMessage: ChatMessage = {
  id: "m1",
  role: "bot",
  content:
    "<b class='text-[15px]'>您好，我是TMJ数字专家，很高兴为您服务。</b><br/>您现在处于<span class='text-blue-600'>初诊状态</span>，我将为您进行初步问诊。",
  createdAt: now,
  status: "success",
  is_finished: false,
};

// 从store中恢复会话状态，如果没有则使用默认欢迎消息
const messages = ref<ChatMessage[]>([]);

const inputText = ref("");
const isResponding = ref(false);
const scrollEl = ref<HTMLElement | null>(null);
const router = useRouter();
const modalVisible = ref(false);
const activeTool = ref("X线");
const chatStore = useChatStore();

const canSend = computed(
  () => inputText.value.trim().length > 0 && !isResponding.value
);

function scrollToBottom() {
  if (!scrollEl.value) return;
  nextTick(() => {
    scrollEl.value!.scrollTop = scrollEl.value!.scrollHeight;
  });
}

watch(messages, scrollToBottom, { deep: true });

async function onSend() {
  if (!canSend.value) return;
  const text = inputText.value.trim();
  inputText.value = "";
  const id = `${Date.now()}-${Math.random()}`;
  messages.value.push({
    id,
    role: "user",
    content: text,
    createdAt: Date.now(),
    status: "sending",
  });
  // 同步更新store
  chatStore.setMessages(messages.value);
  scrollToBottom();

  // 先添加AI正在生成回复的状态消息
  const aiTypingId = `${Date.now()}-${Math.random()}`;
  messages.value.push({
    id: aiTypingId,
    role: "bot",
    content: "正在生成回复...",
    createdAt: Date.now(),
    status: "sending",
  });
  scrollToBottom();

  try {
    // 调用实际接口
    const res = await http.post<AiChatResponse>("/ai-chat", {
      conversation: messages.value.slice(1).map((x) => ({
        role: x.role === "user" ? "user" : "assistant",
        content: x.content,
      })),
      patient_reply: text,
      session_id: sessionId.value,
    });

    // 更新用户消息状态为成功
    const userMessage = messages.value.find((x) => x.id === id);
    if (userMessage) {
      userMessage.status = "success";
    }

    // 处理AI回复
    const responseData = res && "data" in res ? res.data : res;
    if (responseData) {
      // 更新AI正在生成的消息为实际回复
      setTimeout(() => {
        const aiTypingMessage = messages.value.find((x) => x.id === aiTypingId);
        if (aiTypingMessage) {
          aiTypingMessage.content = responseData.next_question || "收到您的消息";
          aiTypingMessage.status = "success";
          aiTypingMessage.is_finished = responseData.is_finished || false;
          // 同步更新store
          chatStore.setMessages(messages.value);
        }
      }, 500)
    }
  } catch (error: any) {
    // 处理错误情况
    const userMessage = messages.value.find((x) => x.id === id);
    if (userMessage) {
      userMessage.status = error.code === "ECONNABORTED" ? "timeout" : "failed";
    }

    // 移除AI正在生成的消息，因为用户消息发送失败，AI不会回复
    setTimeout(() => {
      const aiTypingMessageIndex = messages.value.findIndex((x) => x.id === aiTypingId);
      if (aiTypingMessageIndex !== -1) {
        messages.value.splice(aiTypingMessageIndex, 1);
      }
    }, 1000)
  }
}

async function retryUser(m: ChatMessage) {
  if (m.role !== "user" || m.status === "sending") return;
  m.status = "sending";

  // 先添加AI正在生成回复的状态消息
  const aiTypingId = `${Date.now()}-${Math.random()}`;
  messages.value.push({
    id: aiTypingId,
    role: "bot",
    content: "正在生成回复...",
    createdAt: Date.now(),
    status: "sending",
  });
  scrollToBottom();

  try {
    // 调用实际接口重试
    const res = await http.post<AiChatResponse>("/ai-chat", {
      conversation: messages.value.slice(1),
      patient_reply: m.content,
      session_id: sessionId.value,
    });

    m.status = "success";

    // 处理AI回复
    const responseData = res && "data" in res ? res.data : res;
    if (responseData) {
      // 更新AI正在生成的消息为实际回复
      const aiTypingMessage = messages.value.find((x) => x.id === aiTypingId);
      if (aiTypingMessage) {
        aiTypingMessage.content = responseData.next_question || "收到您的消息";
        aiTypingMessage.status = "success";
        aiTypingMessage.is_finished = responseData.is_finished || false;
      }
    }
  } catch (error: any) {
    m.status = error.code === "ECONNABORTED" ? "timeout" : "failed";

    // 移除AI正在生成的消息，因为用户消息重试失败，AI不会回复
    setTimeout(() => {
      const aiTypingMessageIndex = messages.value.findIndex((x) => x.id === aiTypingId);
      if (aiTypingMessageIndex !== -1) {
        messages.value.splice(aiTypingMessageIndex, 1);
      }
    }, 1000);
  }
}

async function retryBot(m: ChatMessage) {
  if (m.role !== "bot" || isResponding.value) return;
  // 重新生成基于上一条用户消息
  const lastUser = [...messages.value].reverse().find((x) => x.role === "user");
  if (!lastUser) return;
  isResponding.value = true;
  m.status = "sending";

  try {
    // 显示AI正在重新生成回复
    m.content = "AI正在重新思考中...";
    m.status = "sending";
    scrollToBottom();

    // 调用实际接口重新生成回复
    const res = await http.post<AiChatResponse>("/ai-chat", {
      conversation: messages.value.slice(1),
      patient_reply: lastUser.content,
      session_id: sessionId.value,
    });

    const responseData = res && "data" in res ? res.data : res;
    if (responseData) {
      // 替换失败消息为新回复
      m.content = responseData.next_question || "收到您的消息";
      m.createdAt = Date.now();
      m.status = "success";
      m.is_finished = responseData.is_finished || false;
    }
  } catch (error: any) {
    m.status = error.code === "ECONNABORTED" ? "timeout" : "failed";
    m.content = error.code === "ECONNABORTED"
      ? "抱歉，本次回复超时，请稍后重试。"
      : "抱歉，生成失败，请稍后重试。";
    m.createdAt = Date.now();
  } finally {
    isResponding.value = false;
  }
}

function onEnter(e: KeyboardEvent) {
  if (e.shiftKey) {
    // 允许换行
    inputText.value += "\n";
    return;
  }
  onSend();
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function formatTime(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${y}-${m}-${day} ${h}:${mi}`;
}

function setFeedback(m: ChatMessage, fb: Feedback) {
  if (m.role !== "bot") return;
  m.feedback = m.feedback === fb ? null : fb;
}

function goCase() {
  // 将当前会话上下文写入全局 store 后跳转
  chatStore.setSession(sessionId.value);
  chatStore.setMessages(messages.value);
  router.push({ name: "case" });
}

function goDiagnosis() {
  // 将当前会话上下文写入全局 store 后跳转
  chatStore.setSession(sessionId.value);
  chatStore.setMessages(messages.value);
  router.push({ name: "diagnosis" });
}

function restartConsultation() {
  // 重新开始问诊，清空当前会话记录并生成新的sessionId
  chatStore.reset();
  // 同步本地sessionId
  sessionId.value = chatStore.sessionId;
  // 清空本地消息记录
  messages.value = [defaultWelcomeMessage];
  initChat()
  // 滚动到顶部
  if (scrollEl.value) {
    scrollEl.value.scrollTop = 0;
  }
}

function openModal(tool: string) {
  activeTool.value = tool;
  modalVisible.value = true;
}

async function initChat() {
  try {
    const res = await http.post<AiChatResponse>("/ai-chat", {
      conversation: [],
      patient_reply: "你好",
      session_id: sessionId.value,
    });

    const responseData = res && "data" in res ? res.data : res;
    if (responseData) {
      // 更新欢迎消息或添加新的AI回复
      messages.value.push({
        id: `${Date.now()}-${Math.random()}`,
        role: "bot",
        content: responseData.next_question || "请问最近有什么不舒服的情况？",
        createdAt: Date.now(),
        status: "success",
        is_finished: responseData.is_finished || false,
      });
    }
  } catch (error) {
    console.error("初始化聊天失败:", error);
    // 保持原有的欢迎消息
  }
}

onMounted(async () => {
  // 从store中恢复会话状态
  if (chatStore.messages.length > 0) {
    // 如果有保存的会话记录，恢复它们
    messages.value = [...chatStore.messages];
    sessionId.value = chatStore.sessionId;
  } else {
    // 如果没有会话记录，使用默认欢迎消息
    messages.value = [defaultWelcomeMessage];
    // 确保store中的sessionId与本地一致
    chatStore.setSession(sessionId.value);
    initChat()
  }

  // 滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.main-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-row {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

/* 左侧导航栏样式 */
.sidebar-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
}

.title-icon {
  font-size: 18px;
}

.title-text {
  font-size: 14px;
}

.analysis-list {
  .arco-list-item {
    padding: 0;
    border: none;
  }
}

.analysis-item {
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: translateX(4px);

    .item-content {
      color: white;
    }

    .item-icon {
      transform: scale(1.1);
    }
  }
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.3s ease;
}

.item-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

/* 聊天卡片样式 */
.chat-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

  :deep(.arco-card-body) {
    height: 100%;
    padding: 0;
  }
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  flex-shrink: 0;
}

.header-icon {
  font-size: 20px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  flex: 1;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #10b981;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

/* 聊天容器样式 */
.chat-container {
  height: calc(100% - 66px - 148px - 20px);
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  min-height: 0;
  margin-bottom: 20px;

  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */

  &::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }

  /* 滚动时显示淡入淡出效果 */
  &::before {
    content: "";
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(to bottom,
        rgba(255, 255, 255, 0.95),
        transparent);
    pointer-events: none;
    z-index: 10;
  }

  &::after {
    content: "";
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.95), transparent);
    pointer-events: none;
    z-index: 10;
  }
}

/* 操作区 */
.action-container {
  position: fixed;
  left: 0;
  bottom: 20px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

/* 消息样式 */
.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;

  &.bot-message {
    justify-content: flex-start;
  }

  &.user-message {
    justify-content: flex-end;
  }
}

.user-message-wrapper {
  margin-bottom: 20px;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;

  &.user-time {
    text-align: right;
    margin-right: 54px;
  }
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;

  &.bot-bubble {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    color: #374151;
    border-bottom-left-radius: 6px;
  }

  &.user-bubble {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border-bottom-right-radius: 6px;
  }

  &.typing-bubble {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* 头像样式 */
.ai-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar-icon {
  width: 32px;
  height: 32px;
  // background: linear-gradient(135deg, #8b5cf6 0%, #fbbf24 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

/* 打字动画 */
.typing-indicator {
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #9ca3af;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

.typing-text {
  color: #6b7280;
  font-size: 13px;
}

@keyframes typing {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
  margin-bottom: 20px;
}

.action-btn {
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.secondary-btn {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #6b7280;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(248, 250, 252, 0.95) 100%);
      border-color: #3b82f6;
      color: #1e40af;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15),
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

/* 输入框样式 */
.input-container {
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }
}

.input-actions {
  display: flex;
  align-items: flex-end;
}

.send-button {
  border-radius: 12px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
