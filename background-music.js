// 背景音乐控制器
// 处理游戏背景音乐的播放、暂停和控制

// 创建音频对象
let backgroundMusic = null;
let isMusicPlaying = false;
let isMusicInitialized = false;
let musicVolume = 0.25; // 默认音量从0.3调整为0.25
let volumeSliderVisible = false;

// 初始化背景音乐
function initBackgroundMusic() {
    if (backgroundMusic === null) {
        backgroundMusic = new Audio('dreamland.mp3');
        backgroundMusic.loop = true; // 循环播放
        backgroundMusic.volume = musicVolume;
        backgroundMusic.preload = 'auto';
        
        // 添加音频结束事件处理
        backgroundMusic.addEventListener('ended', function() {
            // 由于设置了loop，这个事件通常不会触发，但为了安全起见
            if (isMusicPlaying) {
                backgroundMusic.play().catch(error => {
                    console.warn('背景音乐播放失败:', error);
                });
            }
        });
        
        isMusicInitialized = true;
        console.log('背景音乐已初始化');
    }
}

// 播放背景音乐
function playBackgroundMusic() {
    if (!isMusicInitialized) {
        initBackgroundMusic();
    }
    
    if (backgroundMusic && !isMusicPlaying) {
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicButton();
            console.log('背景音乐开始播放');
        }).catch(error => {
            console.warn('背景音乐播放失败:', error);
        });
    }
}

// 暂停背景音乐
function pauseBackgroundMusic() {
    if (backgroundMusic && isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        updateMusicButton();
        console.log('背景音乐已暂停');
    }
}

// 切换背景音乐播放状态
function toggleBackgroundMusic() {
    if (isMusicPlaying) {
        pauseBackgroundMusic();
    } else {
        playBackgroundMusic();
    }
}

// 设置音量
function setMusicVolume(volume) {
    if (volume >= 0 && volume <= 1) {
        musicVolume = volume;
        if (backgroundMusic) {
            backgroundMusic.volume = volume;
        }
        // 更新滑块显示值
        const volumeSlider = document.getElementById('music-volume-slider');
        if (volumeSlider) {
            volumeSlider.value = volume * 100;
        }
    }
}

// 创建音量滑块
function createVolumeSlider() {
    // 检查是否已存在
    if (document.getElementById('volume-slider-container')) {
        return;
    }
    
    // 创建滑块容器
    const volumeContainer = document.createElement('div');
    volumeContainer.id = 'volume-slider-container';
    volumeContainer.className = 'volume-slider-container';
    
    // 添加音量图标
    const volumeIcon = document.createElement('div');
    volumeIcon.className = 'volume-icon';
    volumeIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
    `;
    
    // 创建滑块
    const volumeSlider = document.createElement('input');
    volumeSlider.id = 'music-volume-slider';
    volumeSlider.className = 'volume-slider';
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = musicVolume * 100;
    
    // 添加滑块事件
    volumeSlider.addEventListener('input', function() {
        const newVolume = this.value / 100;
        setMusicVolume(newVolume);
    });
    
    // 组装滑块控件
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(volumeSlider);
    
    // 将滑块添加到文档
    document.body.appendChild(volumeContainer);
}

// 切换音量滑块显示状态
function toggleVolumeSlider() {
    const volumeContainer = document.getElementById('volume-slider-container');
    if (volumeContainer) {
        volumeSliderVisible = !volumeSliderVisible;
        if (volumeSliderVisible) {
            volumeContainer.classList.add('visible');
        } else {
            volumeContainer.classList.remove('visible');
        }
    }
}

// 创建音乐控制按钮
function createMusicButton() {
    // 检查是否已存在按钮
    if (document.getElementById('music-control-button')) {
        return;
    }
    
    // 创建音乐控制按钮容器
    const musicButtonContainer = document.createElement('div');
    musicButtonContainer.id = 'music-control-container';
    musicButtonContainer.style.position = 'fixed';
    musicButtonContainer.style.bottom = '20px';
    musicButtonContainer.style.right = '20px';
    musicButtonContainer.style.zIndex = '1000';
    
    // 创建音乐按钮
    const musicButton = document.createElement('button');
    musicButton.id = 'music-control-button';
    musicButton.className = 'btn music-btn';
    musicButton.setAttribute('aria-label', '背景音乐控制');
    musicButton.setAttribute('data-sound-added', 'true'); // 标记已添加音效
    
    // 设置音乐按钮样式
    musicButton.style.width = '56px';
    musicButton.style.height = '56px';
    musicButton.style.borderRadius = '50%';
    musicButton.style.backgroundColor = '#3B82F6';
    musicButton.style.color = 'white';
    musicButton.style.border = 'none';
    musicButton.style.display = 'flex';
    musicButton.style.alignItems = 'center';
    musicButton.style.justifyContent = 'center';
    musicButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
    musicButton.style.cursor = 'pointer';
    musicButton.style.transition = 'all 0.3s ease';
    musicButton.style.outline = 'none';
    
    // 设置音乐图标 (初始为暂停状态)
    updateMusicButtonIcon(musicButton);
    
    // 添加点击事件
    musicButton.addEventListener('click', function(event) {
        toggleBackgroundMusic();
        
        // 使用现有的按钮音效功能（如果存在）
        if (window.playButtonSound) {
            window.playButtonSound();
        }
        
        // 阻止事件冒泡，避免触发其他事件
        event.stopPropagation();
    });
    
    // 添加右键点击事件 - 显示/隐藏音量滑块
    musicButton.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // 阻止默认右键菜单
        toggleVolumeSlider();
        
        // 使用现有的按钮音效功能（如果存在）
        if (window.playButtonSound) {
            window.playButtonSound();
        }
    });
    
    // 添加长按事件 - 显示/隐藏音量滑块（移动设备友好）
    let longPressTimer;
    musicButton.addEventListener('touchstart', function(event) {
        longPressTimer = setTimeout(function() {
            toggleVolumeSlider();
            if (window.playButtonSound) {
                window.playButtonSound();
            }
        }, 800); // 800毫秒长按
    });
    
    musicButton.addEventListener('touchend', function() {
        clearTimeout(longPressTimer);
    });
    
    // 添加双击事件 - 显示/隐藏音量滑块
    let lastClickTime = 0;
    musicButton.addEventListener('click', function(event) {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 300) { // 双击间隔300毫秒
            toggleVolumeSlider();
        }
        lastClickTime = currentTime;
    });
    
    // 添加悬停和按下效果
    musicButton.addEventListener('mouseover', function() {
        musicButton.style.transform = 'scale(1.05)';
        musicButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    });
    
    musicButton.addEventListener('mouseout', function() {
        musicButton.style.transform = 'scale(1)';
        musicButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
    });
    
    musicButton.addEventListener('mousedown', function() {
        musicButton.style.transform = 'scale(0.95)';
    });
    
    musicButton.addEventListener('mouseup', function() {
        musicButton.style.transform = 'scale(1.05)';
    });
    
    // 将按钮添加到容器
    musicButtonContainer.appendChild(musicButton);
    
    // 将容器添加到文档
    document.body.appendChild(musicButtonContainer);
    
    // 创建音量滑块
    createVolumeSlider();
    
    // 添加点击document隐藏音量滑块
    document.addEventListener('click', function(event) {
        if (volumeSliderVisible) {
            // 检查点击是否在音量滑块容器或音乐按钮外
            const volumeContainer = document.getElementById('volume-slider-container');
            const musicBtn = document.getElementById('music-control-button');
            
            if (volumeContainer && !volumeContainer.contains(event.target) && !musicBtn.contains(event.target)) {
                volumeSliderVisible = false;
                volumeContainer.classList.remove('visible');
            }
        }
    });
}

// 更新音乐按钮状态
function updateMusicButton() {
    const musicButton = document.getElementById('music-control-button');
    if (musicButton) {
        updateMusicButtonIcon(musicButton);
        
        // 更新动画类
        if (isMusicPlaying) {
            musicButton.classList.add('playing');
        } else {
            musicButton.classList.remove('playing');
        }
    }
}

// 更新音乐按钮图标
function updateMusicButtonIcon(button) {
    // 设置音乐图标 (使用SVG图标)
    const playing = isMusicPlaying;
    
    // 音量/静音图标
    const iconSVG = playing ? 
        `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>`;
    
    button.innerHTML = iconSVG;
    
    if (playing) {
        button.title = '点击暂停背景音乐\n右键/双击/长按显示音量控制';
        button.style.backgroundColor = '#3B82F6'; // 蓝色表示播放中
    } else {
        button.title = '点击播放背景音乐\n右键/双击/长按显示音量控制';
        button.style.backgroundColor = '#6B7280'; // 灰色表示暂停
    }
}

// 当文档加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化背景音乐系统...');
    initBackgroundMusic();
    createMusicButton();
    
    // 添加自动播放检测
    document.addEventListener('click', function() {
        if (!isMusicPlaying && backgroundMusic) {
            // 用户与页面交互后尝试播放音乐
            playBackgroundMusic();
        }
    }, { once: true });
});

// 导出全局函数
window.toggleBackgroundMusic = toggleBackgroundMusic;
window.setMusicVolume = setMusicVolume;
window.pauseBackgroundMusic = pauseBackgroundMusic;
window.playBackgroundMusic = playBackgroundMusic; 