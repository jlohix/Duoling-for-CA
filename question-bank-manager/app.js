/* ============================================
   Updated Question Bank Manager — Application Logic
   With Gemini Vision AI & KaTeX Support
   ============================================ */

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/jlohix/Duoling-for-CA/main/';

// State
let questions = [];
let pendingImages = []; // { name, dataUrl, file }
let localImageStore = {}; // imageName -> dataUrl
let geminiApiKey = '';
let currentAiImageBase64 = null;
let currentAiImageMime = null;
let extractedBatchQuestions = [];

// DOM Elements
const form = document.getElementById('question-form');
const editIndexInput = document.getElementById('edit-index');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnSubmitText = document.getElementById('btn-submit-text');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const btnClearForm = document.getElementById('btn-clear-form');
const btnDownloadCSV = document.getElementById('btn-download-csv');
const btnImportCSV = document.getElementById('btn-import-csv');
const csvImportInput = document.getElementById('csv-import-input');
const searchInput = document.getElementById('search-input');
const filterTopic = document.getElementById('filter-topic');
const emptyState = document.getElementById('empty-state');
const questionsTable = document.getElementById('questions-table');
const questionsTbody = document.getElementById('questions-tbody');
const toastContainer = document.getElementById('toast-container');

// API Key Elements
const btnApiKey = document.getElementById('btn-api-key');
const apiKeyStatusText = document.getElementById('api-key-status-text');
const modalApiKey = document.getElementById('modal-api-key');
const inputApiKey = document.getElementById('input-api-key');
const btnCloseApiModal = document.getElementById('btn-close-api-modal');
const btnSaveApiKey = document.getElementById('btn-save-api-key');
const btnRemoveApiKey = document.getElementById('btn-remove-api-key');

// AI Elements
const aiDropzone = document.getElementById('ai-dropzone');
const aiImageInput = document.getElementById('ai-image-input');
const aiUploadPlaceholder = document.getElementById('ai-upload-placeholder');
const aiPreviewBox = document.getElementById('ai-preview-box');
const aiPreviewImg = document.getElementById('ai-preview-img');
const aiFileName = document.getElementById('ai-file-name');
const btnClearAiImage = document.getElementById('btn-clear-ai-image');
const btnRunAi = document.getElementById('btn-run-ai');

// Batch Modal Elements
const modalBatchAi = document.getElementById('modal-batch-ai');
const btnCloseBatchModal = document.getElementById('btn-close-batch-modal');
const btnCancelBatch = document.getElementById('btn-cancel-batch');
const btnImportAllBatch = document.getElementById('btn-import-all-batch');
const batchList = document.getElementById('batch-list');
const batchCount = document.getElementById('batch-count');

// Image Elements
const imageUploadArea = document.getElementById('image-upload-area');
const imageInput = document.getElementById('image-input');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const btnRemoveImage = document.getElementById('btn-remove-image');
const imageNameInput = document.getElementById('q-image-name');
const githubUrlPreview = document.getElementById('github-url-preview');
const githubUrlText = document.getElementById('github-url-text');
const btnCopyUrl = document.getElementById('btn-copy-url');

// KaTeX Explanation Elements
const qExplanation = document.getElementById('q-explanation');
const katexPreviewContent = document.getElementById('katex-preview-content');

// Stats Elements
const statTotal = document.getElementById('stat-total');
const statWithImages = document.getElementById('stat-with-images');
const statTopics = document.getElementById('stat-topics');
const statDifficulty = document.getElementById('stat-difficulty');

// Download Modal
const imageDownloadModal = document.getElementById('image-download-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalOverlay = document.getElementById('modal-overlay');
const btnDownloadImages = document.getElementById('btn-download-images');
const pendingImagesList = document.getElementById('pending-images-list');

// Current image upload state
let currentImageData = null;
let currentImageFile = null;

// ============================================
// Initialization
// ============================================

function init() {
  loadFromStorage();
  updateApiKeyStatusUI();
  renderTable();
  updateStats();
  autoFillId();
  bindEvents();
}

function bindEvents() {
  form.addEventListener('submit', handleFormSubmit);
  btnClearForm.addEventListener('click', resetForm);
  btnCancelEdit.addEventListener('click', cancelEdit);
  btnDownloadCSV.addEventListener('click', downloadCSV);
  btnImportCSV.addEventListener('click', () => csvImportInput.click());
  csvImportInput.addEventListener('change', handleCSVImport);
  searchInput.addEventListener('input', renderTable);
  filterTopic.addEventListener('change', renderTable);

  // API Key Modal
  btnApiKey.addEventListener('click', () => {
    inputApiKey.value = geminiApiKey || '';
    modalApiKey.style.display = 'flex';
  });
  btnCloseApiModal.addEventListener('click', () => modalApiKey.style.display = 'none');
  btnSaveApiKey.addEventListener('click', saveApiKey);
  btnRemoveApiKey.addEventListener('click', removeApiKey);

  // AI Dropzone & File Selection
  aiDropzone.addEventListener('click', (e) => {
    if (e.target !== btnClearAiImage && !btnClearAiImage.contains(e.target)) {
      aiImageInput.click();
    }
  });
  aiImageInput.addEventListener('change', handleAiImageSelect);
  btnClearAiImage.addEventListener('click', (e) => {
    e.stopPropagation();
    clearAiImage();
  });
  btnRunAi.addEventListener('click', runGeminiAiExtraction);

  // AI Drag & Drop
  aiDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    aiDropzone.classList.add('drag-over');
  });
  aiDropzone.addEventListener('dragleave', () => aiDropzone.classList.remove('drag-over'));
  aiDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    aiDropzone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type.startsWith('image/')) {
      processAiImageFile(e.dataTransfer.files[0]);
    }
  });

  // Batch Modal
  btnCloseBatchModal.addEventListener('click', () => modalBatchAi.style.display = 'none');
  btnCancelBatch.addEventListener('click', () => modalBatchAi.style.display = 'none');
  btnImportAllBatch.addEventListener('click', importAllBatchQuestions);

  // Live KaTeX Explanation Preview
  qExplanation.addEventListener('input', renderKaTeXExplanationPreview);

  // Image Upload Form
  imageUploadArea.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', handleImageSelect);
  btnRemoveImage.addEventListener('click', (e) => { e.stopPropagation(); removeImage(); });
  imageNameInput.addEventListener('input', updateGithubUrlPreview);
  btnCopyUrl.addEventListener('click', copyGithubUrl);

  // Download Modal
  btnCloseModal.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  btnDownloadImages.addEventListener('click', downloadAllImages);
}

// ============================================
// Storage & API Key
// ============================================

function saveToStorage() {
  try {
    localStorage.setItem('qb_questions', JSON.stringify(questions));
    localStorage.setItem('qb_local_images', JSON.stringify(localImageStore));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem('qb_questions');
    if (stored) questions = JSON.parse(stored);

    const storedImages = localStorage.getItem('qb_local_images');
    if (storedImages) localImageStore = JSON.parse(storedImages);

    const key = localStorage.getItem('qb_gemini_key');
    if (key) geminiApiKey = key;
  } catch (e) {
    console.warn('Storage load failed:', e);
  }
}

function saveApiKey() {
  const key = inputApiKey.value.trim();
  if (!key) {
    showToast('error', 'Please enter a valid API Key');
    return;
  }
  geminiApiKey = key;
  localStorage.setItem('qb_gemini_key', geminiApiKey);
  updateApiKeyStatusUI();
  modalApiKey.style.display = 'none';
  showToast('success', 'Gemini API Key saved!');
}

function removeApiKey() {
  geminiApiKey = '';
  localStorage.removeItem('qb_gemini_key');
  inputApiKey.value = '';
  updateApiKeyStatusUI();
  modalApiKey.style.display = 'none';
  showToast('success', 'Gemini API Key removed');
}

function updateApiKeyStatusUI() {
  if (geminiApiKey) {
    apiKeyStatusText.textContent = 'API Key Saved ✓';
    btnApiKey.style.borderColor = 'var(--accent-success)';
  } else {
    apiKeyStatusText.textContent = 'Set API Key';
    btnApiKey.style.borderColor = 'var(--border-glass)';
  }
}

// ============================================
// AI Vision Screenshot Extraction (Gemini 2.0 Flash)
// ============================================

function handleAiImageSelect(e) {
  const file = e.target.files[0];
  if (file) processAiImageFile(file);
}

function processAiImageFile(file) {
  if (file.size > 10 * 1024 * 1024) {
    showToast('error', 'Image must be under 10MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    currentAiImageBase64 = dataUrl.split(',')[1];
    currentAiImageMime = file.type || 'image/png';

    aiPreviewImg.src = dataUrl;
    aiFileName.textContent = file.name;
    aiUploadPlaceholder.style.display = 'none';
    aiPreviewBox.style.display = 'block';

    showToast('success', 'Screenshot ready for AI analysis!');
  };
  reader.readAsDataURL(file);
}

function clearAiImage() {
  currentAiImageBase64 = null;
  currentAiImageMime = null;
  aiPreviewImg.src = '';
  aiFileName.textContent = '';
  aiUploadPlaceholder.style.display = 'flex';
  aiPreviewBox.style.display = 'none';
  aiImageInput.value = '';
}

async function runGeminiAiExtraction() {
  if (!geminiApiKey) {
    showToast('error', 'Please click "Set API Key" in header first!');
    modalApiKey.style.display = 'flex';
    return;
  }

  if (!currentAiImageBase64) {
    showToast('error', 'Please upload a ChatGPT solution or question screenshot first!');
    return;
  }

  btnRunAi.disabled = true;
  btnRunAi.innerHTML = `
    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
    Analyzing Screenshot & LaTeX Math...
  `;

  try {
    const systemPrompt = `
You are an expert Circuit Analysis assistant.
Inspect the provided image containing an MCQ exam question or ChatGPT solution.

Your job:
1. Extract ALL questions or sub-questions found in the image. If there are multiple parts (e.g. Q1a, Q1b, Q1c or Part i, Part ii), separate them into multiple JSON objects.
2. For each question, extract:
   - "question": Question prompt. Convert any math into inline LaTeX format using single dollars, e.g. $V_{out}$ or $\\frac{1}{sC}$.
   - "optionA": Option A text with LaTeX if applicable.
   - "optionB": Option B text with LaTeX if applicable.
   - "optionC": Option C text with LaTeX if applicable.
   - "optionD": Option D text with LaTeX if applicable.
   - "answer": Correct option choice ("optionA", "optionB", "optionC", or "optionD").
   - "explanation": Step-by-step solution extracted from the photo. Make sure all math formulas, fractions, impedances, matrix/equations use LaTeX math $...$.
   - "difficulty": Integer difficulty rating (1 for easy, 2 for medium, 3 for hard).

Return ONLY valid raw JSON array of objects. No markdown backticks, no markdown formatting.
JSON format example:
[
  {
    "question": "Find the transfer function $H(s) = \\frac{V_o(s)}{V_i(s)}$...",
    "optionA": "$1 / (1 + sRC)$",
    "optionB": "$sRC / (1 + sRC)$",
    "optionC": "$1 / sRC$",
    "optionD": "$sRC$",
    "answer": "optionA",
    "explanation": "Using voltage divider: $V_o(s) = V_i(s) \\cdot \\frac{1/sC}{R + 1/sC} = \\frac{1}{1+sRC}$.",
    "difficulty": 1
  }
]
`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            {
              inline_data: {
                mime_type: currentAiImageMime,
                data: currentAiImageBase64
              }
            }
          ]
        }
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API call failed');
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedQuestions = JSON.parse(cleanJson);

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error('No valid questions extracted from image');
    }

    showToast('success', `Extracted ${parsedQuestions.length} question(s) from screenshot!`);

    if (parsedQuestions.length === 1) {
      // Single question -> Auto-fill form directly
      autoFillFormWithExtracted(parsedQuestions[0]);
    } else {
      // Multi-part questions -> Show Batch Import Modal
      openBatchModal(parsedQuestions);
    }

  } catch (err) {
    console.error(err);
    showToast('error', 'AI Extraction error: ' + err.message);
  } finally {
    btnRunAi.disabled = false;
    btnRunAi.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Extract Question & Math Solution
    `;
  }
}

function autoFillFormWithExtracted(q) {
  document.getElementById('q-question').value = q.question || '';
  document.getElementById('q-optionA').value = q.optionA || '';
  document.getElementById('q-optionB').value = q.optionB || '';
  document.getElementById('q-optionC').value = q.optionC || '';
  document.getElementById('q-optionD').value = q.optionD || '';
  document.getElementById('q-answer').value = q.answer || 'optionA';
  document.getElementById('q-difficulty').value = q.difficulty || 1;
  document.getElementById('q-explanation').value = q.explanation || '';

  renderKaTeXExplanationPreview();
  showToast('success', 'Form auto-filled with extracted question & LaTeX solution!');
}

// ============================================
// Multi-Part Batch Modal
// ============================================

function openBatchModal(qs) {
  extractedBatchQuestions = qs;
  batchCount.textContent = qs.length;
  batchList.innerHTML = '';

  qs.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'batch-card';

    const answerLetter = (q.answer || 'optionA').replace('option', '');

    card.innerHTML = `
      <div class="batch-card-header">
        <span class="batch-card-title">Part ${idx + 1}</span>
        <span class="answer-chip answer-${answerLetter}">Ans: ${answerLetter}</span>
      </div>
      <div style="font-size:0.88rem; font-weight:600; margin-bottom:6px;">${escapeHtml(q.question)}</div>
      <div class="batch-options-grid">
        <div><strong>A:</strong> ${escapeHtml(q.optionA)}</div>
        <div><strong>B:</strong> ${escapeHtml(q.optionB)}</div>
        <div><strong>C:</strong> ${escapeHtml(q.optionC)}</div>
        <div><strong>D:</strong> ${escapeHtml(q.optionD)}</div>
      </div>
      <div style="font-size:0.8rem; color:var(--text-secondary); background:rgba(0,0,0,0.3); padding:8px; border-radius:6px;" class="batch-katex-expl">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
      </div>
    `;

    batchList.appendChild(card);
  });

  modalBatchAi.style.display = 'flex';

  // Render KaTeX inside batch modal
  setTimeout(() => {
    if (window.renderMathInElement) {
      renderMathInElement(batchList, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  }, 100);
}

function importAllBatchQuestions() {
  if (extractedBatchQuestions.length === 0) return;

  const currentTopic = document.getElementById('q-topicid').value.trim() || '1';
  let nextId = getNextAvailableId();

  extractedBatchQuestions.forEach(q => {
    questions.push({
      id: String(nextId++),
      topicid: currentTopic,
      question: q.question || '',
      optionA: q.optionA || '',
      optionB: q.optionB || '',
      optionC: q.optionC || '',
      optionD: q.optionD || '',
      answer: q.answer || 'optionA',
      image: '',
      explanation: q.explanation || '',
      difficulty: String(q.difficulty || 1)
    });
  });

  saveToStorage();
  renderTable();
  updateStats();
  autoFillId();
  modalBatchAi.style.display = 'none';

  showToast('success', `Added ${extractedBatchQuestions.length} sub-questions to spreadsheet!`);
}

// ============================================
// KaTeX Math Preview
// ============================================

function renderKaTeXExplanationPreview() {
  const text = qExplanation.value.trim();
  if (!text) {
    katexPreviewContent.innerHTML = '<span class="preview-empty">Type solution above with $...$ math to preview</span>';
    return;
  }

  katexPreviewContent.textContent = text;

  if (window.renderMathInElement) {
    renderMathInElement(katexPreviewContent, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

// ============================================
// Form & CRUD Operations
// ============================================

function handleFormSubmit(e) {
  e.preventDefault();

  const editIndex = parseInt(editIndexInput.value);
  const isEditing = editIndex >= 0;

  const questionData = {
    id: document.getElementById('q-id').value.trim(),
    topicid: document.getElementById('q-topicid').value.trim(),
    question: document.getElementById('q-question').value.trim(),
    optionA: document.getElementById('q-optionA').value.trim(),
    optionB: document.getElementById('q-optionB').value.trim(),
    optionC: document.getElementById('q-optionC').value.trim(),
    optionD: document.getElementById('q-optionD').value.trim(),
    answer: document.getElementById('q-answer').value,
    image: '',
    explanation: document.getElementById('q-explanation').value.trim(),
    difficulty: document.getElementById('q-difficulty').value,
  };

  // Image handling
  const imageName = imageNameInput.value.trim();
  if (imageName) {
    questionData.image = GITHUB_RAW_BASE + imageName;
    if (currentImageData && currentImageFile) {
      localImageStore[imageName] = currentImageData;
      const existing = pendingImages.findIndex(img => img.name === imageName);
      if (existing >= 0) {
        pendingImages[existing] = { name: imageName, dataUrl: currentImageData, file: currentImageFile };
      } else {
        pendingImages.push({ name: imageName, dataUrl: currentImageData, file: currentImageFile });
      }
    }
  }

  // Duplicate Check
  const duplicateIndex = questions.findIndex((q, i) => q.id === questionData.id && i !== editIndex);
  if (duplicateIndex >= 0) {
    showToast('error', `Question ID ${questionData.id} already exists!`);
    return;
  }

  if (isEditing) {
    questions[editIndex] = questionData;
    showToast('success', `Question ${questionData.id} updated!`);
  } else {
    questions.push(questionData);
    showToast('success', `Question ${questionData.id} added!`);
  }

  saveToStorage();
  renderTable();
  updateStats();
  resetForm();
  autoFillId();
}

function resetForm() {
  form.reset();
  editIndexInput.value = '-1';
  formTitle.textContent = 'Add New Question';
  btnSubmitText.textContent = 'Add Question';
  btnCancelEdit.style.display = 'none';
  removeImage();
  githubUrlPreview.style.display = 'none';
  renderKaTeXExplanationPreview();
  autoFillId();
}

function cancelEdit() {
  resetForm();
  showToast('success', 'Edit cancelled');
}

function autoFillId() {
  document.getElementById('q-id').value = getNextAvailableId();
}

function getNextAvailableId() {
  if (questions.length === 0) return 101;
  const maxId = Math.max(...questions.map(q => parseInt(q.id) || 0));
  return maxId + 1;
}

// ============================================
// Image Upload for Question
// ============================================

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) processImageFile(file);
}

function processImageFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', 'Image must be under 5MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    currentImageData = e.target.result;
    currentImageFile = file;

    imagePreview.src = currentImageData;
    uploadPlaceholder.style.display = 'none';
    imagePreviewContainer.style.display = 'block';

    if (!imageNameInput.value.trim()) {
      const ext = file.name.split('.').pop();
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      imageNameInput.value = baseName + '.' + ext;
    }
    updateGithubUrlPreview();
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  currentImageData = null;
  currentImageFile = null;
  imagePreview.src = '';
  uploadPlaceholder.style.display = 'flex';
  imagePreviewContainer.style.display = 'none';
  imageInput.value = '';
}

function updateGithubUrlPreview() {
  const name = imageNameInput.value.trim();
  if (name) {
    githubUrlText.textContent = GITHUB_RAW_BASE + name;
    githubUrlPreview.style.display = 'flex';
  } else {
    githubUrlPreview.style.display = 'none';
  }
}

function copyGithubUrl() {
  navigator.clipboard.writeText(githubUrlText.textContent).then(() => {
    showToast('success', 'URL copied to clipboard!');
  });
}

// ============================================
// Table Rendering & KaTeX
// ============================================

function renderTable() {
  const search = searchInput.value.toLowerCase().trim();
  const topicFilter = filterTopic.value;

  let filtered = questions.filter((q) => {
    if (topicFilter && q.topicid !== topicFilter) return false;
    if (search) {
      const searchable = `${q.id} ${q.question} ${q.optionA} ${q.optionB} ${q.optionC} ${q.optionD} ${q.explanation}`.toLowerCase();
      if (!searchable.includes(search)) return false;
    }
    return true;
  });

  // Topic filter options
  const topics = [...new Set(questions.map(q => q.topicid).filter(Boolean))].sort();
  const currentTopicValue = filterTopic.value;
  filterTopic.innerHTML = '<option value="">All Topics</option>';
  topics.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = `Topic ${t}`;
    if (t === currentTopicValue) opt.selected = true;
    filterTopic.appendChild(opt);
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'flex';
    questionsTable.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  questionsTable.style.display = 'table';
  questionsTbody.innerHTML = '';

  filtered.forEach((q) => {
    const originalIndex = questions.indexOf(q);
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', q.id);

    const answerLetter = q.answer ? q.answer.replace('option', '') : '—';
    const answerClass = `answer-${answerLetter}`;

    let imageCell;
    if (q.image) {
      const imageName = q.image.replace(GITHUB_RAW_BASE, '');
      const localSrc = localImageStore[imageName];
      imageCell = `<td><img class="td-image-thumb" src="${localSrc ? localSrc : escapeHtml(q.image)}" alt="Q${q.id}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'td-no-image\\'>⚠ GitHub</span>';"></td>`;
    } else {
      imageCell = `<td><span class="td-no-image">None</span></td>`;
    }

    const diffClass = `diff-${q.difficulty || 1}`;

    tr.innerHTML = `
      <td class="td-id">${escapeHtml(q.id)}</td>
      <td class="td-topic">${escapeHtml(q.topicid)}</td>
      <td><div class="td-question">${escapeHtml(q.question)}</div></td>
      <td class="td-answer"><span class="answer-chip ${answerClass}">${answerLetter}</span></td>
      ${imageCell}
      <td><span class="difficulty-badge ${diffClass}">${escapeHtml(q.difficulty || '—')}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon" title="Edit" onclick="editQuestion(${originalIndex})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-icon" title="Delete" onclick="deleteQuestion(${originalIndex})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    `;
    questionsTbody.appendChild(tr);
  });

  // Render KaTeX math in table cells
  if (window.renderMathInElement) {
    renderMathInElement(questionsTbody, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  }
}

function editQuestion(index) {
  const q = questions[index];
  if (!q) return;

  editIndexInput.value = index;
  formTitle.textContent = `Edit Question ${q.id}`;
  btnSubmitText.textContent = 'Save Changes';
  btnCancelEdit.style.display = 'inline-flex';

  document.getElementById('q-id').value = q.id;
  document.getElementById('q-topicid').value = q.topicid;
  document.getElementById('q-question').value = q.question;
  document.getElementById('q-optionA').value = q.optionA;
  document.getElementById('q-optionB').value = q.optionB;
  document.getElementById('q-optionC').value = q.optionC;
  document.getElementById('q-optionD').value = q.optionD;
  document.getElementById('q-answer').value = q.answer;
  document.getElementById('q-explanation').value = q.explanation;
  document.getElementById('q-difficulty').value = q.difficulty;

  if (q.image) {
    const imageName = q.image.replace(GITHUB_RAW_BASE, '');
    imageNameInput.value = imageName;
    updateGithubUrlPreview();

    const localSrc = localImageStore[imageName];
    imagePreview.src = localSrc || q.image;
    uploadPlaceholder.style.display = 'none';
    imagePreviewContainer.style.display = 'block';
  } else {
    removeImage();
    imageNameInput.value = '';
    githubUrlPreview.style.display = 'none';
  }

  renderKaTeXExplanationPreview();
  document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteQuestion(index) {
  const q = questions[index];
  if (!q) return;

  if (confirm(`Delete question ${q.id}?`)) {
    questions.splice(index, 1);
    saveToStorage();
    renderTable();
    updateStats();
    showToast('success', `Question ${q.id} deleted`);
  }
}

// ============================================
// CSV Import & Export
// ============================================

function handleCSVImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const csv = ev.target.result;
      const parsed = parseCSV(csv);

      if (parsed.length === 0) {
        showToast('error', 'No valid questions found in CSV');
        return;
      }

      const action = questions.length > 0
        ? confirm(`You have ${questions.length} existing questions.\n\nClick OK to REPLACE all with imported data.\nClick Cancel to APPEND imported data.`)
          ? 'replace'
          : 'append'
        : 'replace';

      if (action === 'replace') {
        questions = parsed;
      } else {
        questions = [...questions, ...parsed];
      }

      saveToStorage();
      renderTable();
      updateStats();
      autoFillId();
      showToast('success', `Imported ${parsed.length} questions!`);
    } catch (err) {
      showToast('error', 'Failed to parse CSV: ' + err.message);
    }
  };
  reader.readAsText(file);
  csvImportInput.value = '';
}

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    if (values.length < 3) continue;

    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = (values[idx] || '').trim();
    });

    if (!obj.question) continue;

    results.push({
      id: obj.id || '',
      topicid: obj.topicid || '',
      question: obj.question || '',
      optionA: obj.optionA || '',
      optionB: obj.optionB || '',
      optionC: obj.optionC || '',
      optionD: obj.optionD || '',
      answer: obj.answer || '',
      image: obj.image || '',
      explanation: obj.explanation || '',
      difficulty: obj.difficulty || '1',
    });
  }

  return results;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else if (char === '\r') {
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function downloadCSV() {
  if (questions.length === 0) {
    showToast('error', 'No questions to download');
    return;
  }

  const headers = ['id', 'topicid', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'image', 'explanation', 'difficulty'];
  let csv = headers.join(',') + '\r\n';

  questions.forEach(q => {
    const row = headers.map(h => {
      const val = q[h] || '';
      if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
        return '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csv += row.join(',') + '\r\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PYP qns CA(Sheet1).csv';
  a.click();
  URL.revokeObjectURL(url);

  showToast('success', 'CSV downloaded! Ready for GitHub repository.');

  if (pendingImages.length > 0) {
    setTimeout(() => showImageUploadModal(), 800);
  }
}

// ============================================
// Pending Images Modal
// ============================================

function showImageUploadModal() {
  pendingImagesList.innerHTML = '';
  if (pendingImages.length === 0) {
    pendingImagesList.innerHTML = '<p style="color: var(--text-tertiary); font-size: 0.85rem;">No new images to upload.</p>';
  } else {
    pendingImages.forEach(img => {
      const div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:6px;';
      div.innerHTML = `
        <img src="${img.dataUrl}" style="width:40px;height:30px;object-fit:cover;border-radius:4px;">
        <span style="font-size:0.85rem;color:var(--text-secondary);font-family:monospace;">${escapeHtml(img.name)}</span>
      `;
      pendingImagesList.appendChild(div);
    });
  }
  imageDownloadModal.style.display = 'flex';
}

function closeModal() {
  imageDownloadModal.style.display = 'none';
}

function downloadAllImages() {
  pendingImages.forEach(img => {
    const a = document.createElement('a');
    a.href = img.dataUrl;
    a.download = img.name;
    a.click();
  });
  showToast('success', `${pendingImages.length} image(s) downloaded!`);
  closeModal();
}

// ============================================
// Statistics
// ============================================

function updateStats() {
  statTotal.textContent = questions.length;
  statWithImages.textContent = questions.filter(q => q.image).length;
  const topics = new Set(questions.map(q => q.topicid).filter(Boolean));
  statTopics.textContent = topics.size;

  if (questions.length > 0) {
    const avgDiff = questions.reduce((sum, q) => sum + (parseInt(q.difficulty) || 0), 0) / questions.length;
    statDifficulty.textContent = avgDiff.toFixed(1);
  } else {
    statDifficulty.textContent = '1.0';
  }
}

// ============================================
// Toast & Utilities
// ============================================

function showToast(type, message) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : '✕';
  toast.innerHTML = `<span style="font-weight:bold;">${icon}</span><span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
