// 按钮音效播放器
// 处理游戏中所有按钮的点击音效

// 创建一个音频对象缓存池，以避免创建过多的Audio对象
const audioPool = [];
const POOL_SIZE = 5; // 音频池大小

// 初始化音频池
function initAudioPool() {
    for (let i = 0; i < POOL_SIZE; i++) {
        const audio = new Audio('notification.mp3');
        audio.volume = 0.9; // 设置默认音量，从0.5提高到0.8
        audio.preload = 'auto';
        audioPool.push({
            audio: audio,
            inUse: false
        });
    }
    console.log('音频池已初始化，大小：', POOL_SIZE);
}

// 从池中获取一个可用的音频对象
function getAudioFromPool() {
    // 首先尝试找到一个未使用的音频对象
    for (let i = 0; i < audioPool.length; i++) {
        if (!audioPool[i].inUse) {
            audioPool[i].inUse = true;
            return audioPool[i];
        }
    }
    
    // 如果所有对象都在使用中，创建一个新的
    const audio = new Audio('notification.mp3');
    audio.volume = 0.8; // 从0.5提高到0.8
    audio.preload = 'auto';
    const audioObj = { audio: audio, inUse: true };
    audioPool.push(audioObj);
    return audioObj;
}

// 播放按钮音效
function playButtonSound() {
    const audioObj = getAudioFromPool();
    const audio = audioObj.audio;
    
    // 确保音频重新开始播放
    audio.currentTime = 0;
    
    // 播放音频
    audio.play().catch(error => {
        console.warn('音频播放失败:', error);
    });
    
    // 音频播放完成后，将其标记为未使用
    audio.onended = function() {
        audioObj.inUse = false;
    };
}

// 将点击音效添加到所有按钮
function addSoundToAllButtons() {
    // 选择所有按钮元素
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    
    // 为每个按钮添加点击音效
    buttons.forEach(button => {
        // 检查按钮是否已经有音效处理
        if (!button.hasAttribute('data-sound-added')) {
            button.addEventListener('click', function(event) {
                // 只有在按钮未禁用时才播放音效
                if (!button.disabled && !button.classList.contains('btn-disabled')) {
                    playButtonSound();
                }
            });
            // 标记此按钮已添加音效
            button.setAttribute('data-sound-added', 'true');
        }
    });
}

// 定期扫描并添加音效到新按钮
function setupButtonSoundObserver() {
    // 初始添加
    addSoundToAllButtons();
    
    // 设置MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        let shouldAddSound = false;
        
        // 检查是否有新按钮添加
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldAddSound = true;
            }
        });
        
        // 如果有DOM变化，重新添加音效
        if (shouldAddSound) {
            addSoundToAllButtons();
        }
    });
    
    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 另外，设置定期扫描，确保不会遗漏任何按钮
    setInterval(addSoundToAllButtons, 2000);
}

// 当文档加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化按钮音效系统...');
    initAudioPool();
    setupButtonSoundObserver();
});

// 导出全局函数，允许其他脚本手动触发音效
window.playButtonSound = playButtonSound; 