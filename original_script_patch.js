// 修改原始script.js中renderFactViewScreen函数的补丁
// 在页面加载后应用
window.addEventListener('load', function() {
    console.log('应用原始renderFactViewScreen函数补丁...');
    
    // 确保原始函数存在
    if (typeof window.renderFactViewScreen !== 'function') {
        console.error('找不到原始renderFactViewScreen函数');
        return;
    }
    
    // 增强applyModernButtonStyle函数以添加音效
    if (typeof window.applyModernButtonStyle === 'function') {
        const originalApplyModernButtonStyle = window.applyModernButtonStyle;
        
        // 重写函数以添加音效
        window.applyModernButtonStyle = function(btn, options = {}) {
            // 调用原始函数
            originalApplyModernButtonStyle(btn, options);
            
            // 添加按钮音效
            if (!btn.hasAttribute('data-sound-added')) {
                const originalOnClick = btn.onclick;
                
                // 重新定义点击处理函数
                btn.addEventListener('click', function(event) {
                    // 只有在按钮未禁用时才播放音效
                    if (!btn.disabled && !btn.classList.contains('btn-disabled')) {
                        if (typeof window.playButtonSound === 'function') {
                            window.playButtonSound();
                        }
                    }
                });
                
                // 标记此按钮已添加音效
                btn.setAttribute('data-sound-added', 'true');
            }
        };
        
        console.log('已增强applyModernButtonStyle函数以支持按钮音效');
    }
    
    // 保存原始函数
    const originalRenderFactViewScreen = window.renderFactViewScreen;
    
    // 重写函数
    window.renderFactViewScreen = function(screenElement) {
        // 调用原始函数
        originalRenderFactViewScreen(screenElement);
        
        // 在短暂延迟后处理UI修改
        setTimeout(function() {
            console.log('修改fact页面UI...');
            
            // 1. 移除所有emoji图标
            const emojis = document.querySelectorAll('div[style*="fontSize: 3rem"]');
            emojis.forEach(emoji => {
                if (emoji && emoji.parentNode) {
                    emoji.parentNode.removeChild(emoji);
                }
            });
            
            // 2. 移除"Image Placeholder"文本
            const placeholderTexts = Array.from(document.querySelectorAll('*')).filter(
                el => el.textContent === 'Image Placeholder' || 
                     el.textContent === 'Loading image...'
            );
            placeholderTexts.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
            
            // 3. 修改所有图片容器样式
            const imgContainers = document.querySelectorAll('div[style*="paddingBottom"]');
            imgContainers.forEach(container => {
                // 修改为直接显示图片的容器
                container.style.paddingBottom = '0';
                container.style.height = 'auto';
                container.style.backgroundColor = 'transparent';
                container.style.border = 'none';
                container.style.boxShadow = 'none';
            });
            
            // 4. 直接将年份图片添加到适当位置
            const factImageContainers = document.querySelectorAll('.fact-image-container');
            if (factImageContainers.length > 0 && window.gameState && window.gameState.currentEvent) {
                const year = window.gameState.currentEvent.year;
                
                factImageContainers.forEach(container => {
                    // 检查是否已经有图片
                    const existingImg = container.querySelector(`img[src="year${year}.png"]`);
                    if (!existingImg) {
                        // 创建年份图片
                        const imgDiv = document.createElement('div');
                        imgDiv.style.width = '100%';
                        imgDiv.style.margin = '1rem 0';
                        
                        const img = document.createElement('img');
                        img.src = `year${year}.png`;
                        img.alt = `Year ${year} image`;
                        img.style.width = '100%';
                        img.style.borderRadius = '8px';
                        img.style.display = 'block';
                        
                        // 处理加载错误
                        img.onerror = function() {
                            img.style.display = 'none';
                        };
                        
                        imgDiv.appendChild(img);
                        
                        // 查找并替换占位符容器
                        const placeholderDiv = container.querySelector('div[style*="backgroundColor"]');
                        if (placeholderDiv) {
                            container.replaceChild(imgDiv, placeholderDiv);
                        } else {
                            // 如果找不到占位符，直接插入到容器开头
                            container.insertBefore(imgDiv, container.firstChild);
                        }
                        
                        // 更新图片说明文本
                        const caption = container.querySelector('p');
                        if (caption) {
                            caption.textContent = `Year ${year}: ${window.gameState.currentEvent.factContent.title}`;
                            caption.style.textAlign = 'center';
                            caption.style.marginTop = '0.5rem';
                        }
                    }
                });
            }
            
            console.log('完成fact页面UI修改');
        }, 100);
    };
    
    // 增强原始按钮创建函数
    const originalCreateButton = Element.prototype.appendChild;
    Element.prototype.appendChild = function(element) {
        const result = originalCreateButton.apply(this, arguments);
        
        // 如果添加的是按钮元素，自动添加音效
        if (element.tagName === 'BUTTON' || element.classList.contains('btn') || element.getAttribute('role') === 'button') {
            // 检查按钮是否已经有音效处理
            if (!element.hasAttribute('data-sound-added') && typeof window.playButtonSound === 'function') {
                element.addEventListener('click', function(event) {
                    // 只有在按钮未禁用时才播放音效
                    if (!element.disabled && !element.classList.contains('btn-disabled')) {
                        window.playButtonSound();
                    }
                });
                // 标记此按钮已添加音效
                element.setAttribute('data-sound-added', 'true');
            }
        }
        
        return result;
    };
    
    console.log('原始renderFactViewScreen函数补丁已应用');
}); 