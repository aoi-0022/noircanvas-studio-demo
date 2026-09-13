const steps = [...document.querySelectorAll('.step')];
const screens = [...document.querySelectorAll('.screen')];
const title = document.getElementById('screenTitle');
const sidebar = document.querySelector('.sidebar');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;
  steps.forEach((step) => step.classList.toggle('active', step.dataset.screen === id));
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
  title.textContent = target.dataset.title;
  sidebar.classList.remove('open');
  window.scrollTo(0, 0);
}

const requestedScreen = new URLSearchParams(window.location.search).get('screen');
if (requestedScreen) showScreen(requestedScreen);

steps.forEach((step) => step.addEventListener('click', () => showScreen(step.dataset.screen)));
document.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.next)));
document.getElementById('mobileMenu').addEventListener('click', () => sidebar.classList.toggle('open'));

const connectionButton = document.getElementById('connectionButton');
const connectionText = document.getElementById('connectionText');
const connectionPill = document.querySelector('.status-pill');
connectionButton.addEventListener('click', () => {
  const connected = connectionPill.classList.toggle('connected');
  connectionText.textContent = connected ? 'ComfyUI 接続済み' : 'ComfyUI 未接続';
  connectionButton.textContent = connected ? '接続を解除' : '接続を確認';
  showToast(connected ? 'モック上で接続済みに切り替えました。' : 'モック上の接続表示を解除しました。');
});

document.getElementById('addScene')?.addEventListener('click', () => {
  const table = document.querySelector('.scene-table');
  const count = table.querySelectorAll('.scene-row:not(.table-head)').length + 1;
  const row = document.createElement('div');
  row.className = 'scene-row';
  row.setAttribute('role', 'row');
  row.innerHTML = `<span>${String(count).padStart(2, '0')}</span><strong>追加シーン</strong><span>未設定</span><span>1</span><span>3</span><span class="tag draft">編集中</span>`;
  table.appendChild(row);
  document.getElementById('sceneCount').textContent = String(count);
  showToast('モック上にシーンを1件追加しました。');
});

document.querySelectorAll('.prompt-chip').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('selected');
    showToast('選択を切り替えました。製品版では直積の件数を自動計算します。');
  });
});

const simulateButton = document.getElementById('simulateGeneration');
const restButton = document.getElementById('generateRest');
const generationState = document.getElementById('generationState');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const previewLabel = document.getElementById('previewLabel');

simulateButton.addEventListener('click', () => {
  simulateButton.disabled = true;
  generationState.textContent = '生成中';
  generationState.className = 'tag warning';
  progressBar.style.width = '4%';
  progressLabel.textContent = '1 / 1,000';
  previewLabel.textContent = 'ダミー候補を確認中';
  window.setTimeout(() => {
    generationState.textContent = '試し生成完了';
    generationState.className = 'tag ready';
    progressBar.style.width = '8%';
    restButton.disabled = false;
    simulateButton.disabled = false;
    showToast('安全なダミー候補を1枚生成した状態にしました。');
  }, 850);
});

restButton.addEventListener('click', () => {
  generationState.textContent = '予約済み';
  generationState.className = 'tag ready';
  progressBar.style.width = '25%';
  progressLabel.textContent = '250 / 1,000';
  previewLabel.textContent = '未完了750件は再開可能';
  showToast('モック上で長時間バッチを開始しました。');
});

document.querySelectorAll('.select-candidate').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.candidate').forEach((card) => {
      card.classList.remove('selected');
      card.querySelector('.select-candidate').textContent = 'この画像を採用';
    });
    const card = button.closest('.candidate');
    card.classList.remove('held');
    card.querySelector('.hold-candidate').textContent = '保留';
    card.classList.add('selected');
    button.textContent = '採用中';
    showToast('採用候補を切り替えました。');
  });
});

document.querySelectorAll('.hold-candidate').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.candidate');
    const held = card.classList.toggle('held');
    if (held) {
      card.classList.remove('selected');
      card.querySelector('.select-candidate').textContent = 'この画像を採用';
    }
    button.textContent = held ? '保留中' : '保留';
    showToast(held ? '候補を保留にしました。元画像は移動・削除しません。' : '保留を解除しました。');
  });
});

document.querySelectorAll('.segmented button').forEach((button) => {
  button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    showToast(`${button.textContent}表示に切り替えました。`);
  });
});

document.getElementById('validateExport').addEventListener('click', () => {
  const state = document.getElementById('exportState');
  state.textContent = '作成完了';
  state.className = 'tag ready';
  showToast('モック上で本編・サンプル・分割ZIPを作成した状態にしました。');
});
