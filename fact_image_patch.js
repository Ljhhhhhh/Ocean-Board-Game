// 为Fact视图添加年份图片的补丁函数
function patchFactImages() {
    console.log('初始化Fact图片补丁...');
    
    // 确保gameState可访问
    if (typeof window.gameState === 'undefined') {
        console.error('无法访问gameState对象，补丁无法应用');
        return;
    }
    
    // 获取原始renderFactViewScreen函数
    const originalRenderFactViewScreen = window.renderFactViewScreen;
    if (!originalRenderFactViewScreen) {
        console.error('找不到原始renderFactViewScreen函数，补丁无法应用');
        return;
    }
    
    // 替换为新的实现 - 使用更精确的定位方法
    window.renderFactViewScreen = function(screenElement) {
        // 先调用原始函数
        originalRenderFactViewScreen(screenElement);
        
        // 在短暂延迟后处理图片加载
        setTimeout(function() {
            if (!window.gameState.currentEvent) return;
            
            const year = window.gameState.currentEvent.year;
            console.log(`尝试为年份 ${year} 加载图片`);
            
            // 方法0: 替换所有img元素
            const allImages = document.querySelectorAll('img');
            if (allImages.length > 0) {
                allImages.forEach(img => {
                    // 检查是否是占位符图片
                    if (img.src.includes('placeholder') || 
                        img.alt.includes('Placeholder') || 
                        img.alt.includes('placeholder')) {
                        
                        // 替换图片源
                        const originalSrc = img.src;
                        img.src = `year${year}.png`;
                        img.style.objectFit = 'cover';
                        
                        // 处理加载错误
                        img.onerror = function() {
                            console.log('直接替换图片源失败，恢复原始源');
                            img.src = originalSrc;
                        };
                    }
                });
            }
            
            // 方法1: 通过"Image Placeholder"文本内容查找
            const placeholderTexts = Array.from(document.querySelectorAll('p, div')).filter(
                el => el.textContent.includes('Image Placeholder')
            );
            
            if (placeholderTexts.length > 0) {
                console.log('通过文本找到占位符:', placeholderTexts.length);
                
                // 找到包含占位符文本的父元素容器
                let imgContainer = null;
                let placeholderText = placeholderTexts[0];
                
                // 向上查找到合适的容器
                let parent = placeholderText.parentElement;
                while (parent && !imgContainer) {
                    // 查找合适的容器 - 通常是有样式的div
                    if (parent.style && 
                        (parent.style.backgroundColor === 'rgba(59, 130, 246, 0.1)' ||
                         parent.style.backgroundColor === 'rgb(241, 245, 249)' ||
                         parent.className.includes('fact-') ||
                         parent.style.paddingBottom)) {
                        imgContainer = parent;
                    }
                    parent = parent.parentElement;
                }
                
                if (imgContainer) {
                    console.log('找到图片容器:', imgContainer);
                    replaceImagePlaceholder(imgContainer, year);
                    
                    // 立即移除所有emoji图标
                    removeAllEmojis();
                    
                    return;
                }
            }
            
            // 方法2: 查找带有特定样式的容器
            const blueBackgrounds = document.querySelectorAll('div[style*="background-color: rgba(59, 130, 246, 0.1)"]');
            if (blueBackgrounds.length > 0) {
                console.log('找到蓝色背景容器:', blueBackgrounds.length);
                replaceImagePlaceholder(blueBackgrounds[0].parentElement, year);
                removeAllEmojis();
                return;
            }
            
            // 方法3: 查找任何带有paddingBottom的div
            const paddingDivs = document.querySelectorAll('div[style*="paddingBottom"]');
            if (paddingDivs.length > 0) {
                console.log('找到padding容器:', paddingDivs.length);
                replaceImagePlaceholder(paddingDivs[0], year);
                removeAllEmojis();
                return;
            }
            
            // 方法4: 查找图片占位符图标
            const imgIcons = document.querySelectorAll('div:has(img[src*="placeholder"]), img[src*="placeholder"]');
            if (imgIcons.length > 0) {
                console.log('找到图片图标:', imgIcons.length);
                let container = imgIcons[0];
                // 如果是img元素，获取其父容器
                if (container.tagName === 'IMG') {
                    container = container.parentElement;
                }
                replaceImagePlaceholder(container, year);
                removeAllEmojis();
                return;
            }
            
            console.log('未找到任何可用的图片占位符');
        }, 500);
    };
    
    // 替换图片占位符的函数 - 更简洁的显示方式
    function replaceImagePlaceholder(container, year) {
        console.log('替换图片占位符:', container);
        
        // 清空容器内容
        const originalContent = container.innerHTML;
        container.innerHTML = '';
        
        // 设置容器样式 - 无背景、无边框、自适应图片大小
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.margin = '1rem 0';
        container.style.padding = '0';
        container.style.backgroundColor = 'transparent';
        container.style.border = 'none';
        container.style.boxShadow = 'none';
        
        // 创建并添加图片
        const img = document.createElement('img');
        img.src = `year${year}.png`;
        img.alt = `Year ${year} image`;
        img.style.width = '100%';
        img.style.borderRadius = '8px';
        img.style.display = 'block';
        
        // 添加加载错误处理
        img.onerror = function() {
            console.log('图片加载失败，恢复原内容');
            container.innerHTML = originalContent;
        };
        
        container.appendChild(img);
        
        // 替换图片下方的caption文本
        const caption = container.nextElementSibling;
        if (caption && 
            (caption.tagName === 'P' || 
             caption.tagName === 'DIV' || 
             caption.tagName === 'SPAN')) {
            
            if (caption.textContent.includes('Image') || 
                caption.textContent.includes('image') || 
                caption.textContent.includes('related')) {
                
                caption.textContent = `Year ${year}: ${window.gameState.currentEvent.factContent.title}`;
                caption.style.textAlign = 'center';
                caption.style.color = '#4B5563';
                caption.style.fontSize = '0.9rem';
                caption.style.marginTop = '0.5rem';
            }
        }
        
        console.log('图片替换完成');
    }
    
    // 移除所有emoji图标
    function removeAllEmojis() {
        // 移除图标文本
        const emojis = document.querySelectorAll('div[style*="fontSize: 3rem"]');
        if (emojis.length > 0) {
            console.log('移除emoji图标:', emojis.length);
            emojis.forEach(emoji => {
                if (emoji && emoji.parentNode) {
                    emoji.parentNode.removeChild(emoji);
                }
            });
        }
        
        // 移除"Image Placeholder"文本
        const placeholderTexts = Array.from(document.querySelectorAll('*')).filter(
            el => el.textContent === 'Image Placeholder'
        );
        placeholderTexts.forEach(el => {
            el.textContent = '';
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
    
    console.log('Fact图片补丁已成功应用');
}

// 手动触发图片加载的全局函数
window.refreshFactImages = function() {
    if (!window.gameState || !window.gameState.currentEvent) {
        console.log('无法刷新：游戏状态不可用');
        return false;
    }
    
    const year = window.gameState.currentEvent.year;
    console.log(`手动刷新年份${year}的图片`);
    
    // 寻找图片占位符文本
    const placeholderElements = Array.from(document.querySelectorAll('*')).filter(
        el => el.textContent === 'Image Placeholder'
    );
    
    if (placeholderElements.length > 0) {
        console.log('找到占位符元素:', placeholderElements.length);
        
        // 找到占位符的父容器
        const placeholderParent = placeholderElements[0].closest('div');
        if (placeholderParent) {
            // 替换为图片
            placeholderParent.innerHTML = '';
            
            // 设置样式 - 简化容器
            placeholderParent.style.position = 'relative';
            placeholderParent.style.width = '100%';
            placeholderParent.style.margin = '1rem 0';
            placeholderParent.style.padding = '0';
            placeholderParent.style.backgroundColor = 'transparent';
            placeholderParent.style.border = 'none';
            placeholderParent.style.boxShadow = 'none';
            
            // 创建图片
            const img = document.createElement('img');
            img.src = `year${year}.png`;
            img.alt = `Year ${year} image`;
            img.style.width = '100%';
            img.style.borderRadius = '8px';
            img.style.display = 'block';
            
            placeholderParent.appendChild(img);
            console.log('手动刷新成功');
            return true;
        }
    }
    
    // 如果通过文本没找到，尝试通过样式查找
    const blueBgElements = document.querySelectorAll('div[style*="background-color: rgba(59, 130, 246"]');
    if (blueBgElements.length > 0) {
        const container = blueBgElements[0].closest('div');
        if (container) {
            container.innerHTML = '';
            // 简化图片容器
            container.style.backgroundColor = 'transparent';
            container.style.border = 'none';
            container.style.boxShadow = 'none';
            
            const img = document.createElement('img');
            img.src = `year${year}.png`;
            img.alt = `Year ${year} image`;
            img.style.width = '100%';
            img.style.borderRadius = '8px';
            img.style.display = 'block';
            
            container.appendChild(img);
            console.log('通过背景色找到并替换了图片');
            return true;
        }
    }
    
    console.log('未找到合适的元素进行替换');
    return false;
};

// 直接在DOM中查找并替换所有图片占位符的函数
function findAndReplaceAllPlaceholders() {
    // 查找包含"Image Placeholder"文本的元素
    const allElements = document.querySelectorAll('*');
    let found = false;
    
    // 遍历所有元素查找占位符
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        
        // 检查文本内容
        if (element.textContent && element.textContent.trim() === 'Image Placeholder') {
            console.log('找到占位符文本:', element);
            
            // 获取当前年份
            const year = window.gameState?.currentEvent?.year || 1;
            
            // 查找图片容器 - 方式1：直接替换占位符元素
            replaceElement(element, year);
            found = true;
            
            // 方式2：尝试找到父容器并替换
            let parent = element.parentElement;
            if (parent) {
                // 验证是合适的父容器
                if (parent.style && 
                    (parent.style.position === 'relative' || 
                     parent.style.backgroundColor || 
                     parent.style.paddingBottom)) {
                    
                    replaceElement(parent, year);
                }
                
                // 再往上一级查找
                let grandparent = parent.parentElement;
                if (grandparent && grandparent.className && 
                    (grandparent.className.includes('image') || 
                     grandparent.className.includes('placeholder'))) {
                    
                    replaceElement(grandparent, year);
                }
            }
        }
        
        // 检查图片占位符图标
        const img = element.querySelector && element.querySelector('img[src*="placeholder"]');
        if (img) {
            console.log('找到占位符图片:', img);
            const year = window.gameState?.currentEvent?.year || 1;
            replaceElement(element, year);
            found = true;
        }
    }
    
    return found;
    
    // 替换元素的辅助函数 - 使用简化的图片显示方式
    function replaceElement(element, year) {
        try {
            // 克隆节点保留对原始内容的引用
            const originalElement = element.cloneNode(true);
            
            // 清空内容
            element.innerHTML = '';
            
            // 设置样式 - 简化容器
            element.style.position = 'relative';
            element.style.width = '100%';
            element.style.height = 'auto';
            element.style.margin = '1rem 0';
            element.style.padding = '0';
            element.style.backgroundColor = 'transparent';
            element.style.border = 'none';
            element.style.boxShadow = 'none';
            
            // 创建并添加图片
            const img = document.createElement('img');
            img.src = `year${year}.png`;
            img.alt = `Year ${year} image`;
            img.style.width = '100%';
            img.style.display = 'block';
            img.style.borderRadius = '8px';
            
            // 处理加载错误
            img.onerror = function() {
                console.log('图片加载失败，恢复原始内容');
                element.parentNode.replaceChild(originalElement, element);
            };
            
            element.appendChild(img);
            
            // 尝试更新图片说明
            const sibling = element.nextElementSibling;
            if (sibling && sibling.tagName && 
                (sibling.tagName === 'P' || sibling.tagName === 'DIV') && 
                sibling.textContent && 
                (sibling.textContent.includes('Image') || 
                 sibling.textContent.includes('related'))) {
                
                sibling.textContent = `Year ${year}: ${window.gameState.currentEvent.factContent.title}`;
                sibling.style.textAlign = 'center';
                sibling.style.marginTop = '0.5rem';
            }
        } catch (e) {
            console.error('替换元素时出错:', e);
        }
    }
}

// 在页面加载完成后应用补丁，并设置周期性检查
window.addEventListener('load', function() {
    console.log('页面加载完成，应用Fact图片补丁');
    
    // 应用补丁
    setTimeout(patchFactImages, 500);
    
    // 立即进行一次占位符图标清理
    setTimeout(function() {
        // 移除所有图标和占位符框
        const emojis = document.querySelectorAll('div[style*="fontSize: 3rem"]');
        emojis.forEach(emoji => {
            if (emoji && emoji.parentNode) {
                emoji.parentNode.removeChild(emoji);
            }
        });
        
        // 移除"Image Placeholder"文本
        const placeholderTexts = Array.from(document.querySelectorAll('*')).filter(
            el => el.textContent === 'Image Placeholder'
        );
        placeholderTexts.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // 修改所有图片容器
        const imgContainers = document.querySelectorAll('div[style*="paddingBottom"]');
        imgContainers.forEach(container => {
            // 简化为直接显示图片的容器
            container.style.height = 'auto';
            container.style.paddingBottom = '0';
            container.style.backgroundColor = 'transparent';
            container.style.border = 'none';
            container.style.boxShadow = 'none';
        });
    }, 800);
    
    // 设置周期性检查，确保图片被替换
    setInterval(function() {
        // 使用标准DOM API检查占位符是否存在
        const allElements = document.querySelectorAll('div, p, span');
        let placeholderExists = false;
        
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].textContent.includes('Image Placeholder')) {
                placeholderExists = true;
                break;
            }
        }
        
        if (placeholderExists) {
            console.log('检测到未替换的占位符，尝试再次替换');
            findAndReplaceAllPlaceholders();
        }
        
        // 移除所有可能的占位符图标
        const placeholderIcons = document.querySelectorAll('div[style*="fontSize: 3rem"], img[src*="placeholder"]');
        if (placeholderIcons.length > 0) {
            console.log('检测到占位符图标，尝试移除');
            placeholderIcons.forEach(icon => {
                // 如果是图片元素，查找其父容器
                if (icon.tagName === 'IMG') {
                    const parent = icon.parentElement;
                    if (parent && window.gameState && window.gameState.currentEvent) {
                        const year = window.gameState.currentEvent.year;
                        // 替换为年份图片
                        icon.src = `year${year}.png`;
                        icon.style.width = '100%';
                        icon.style.display = 'block';
                        icon.style.borderRadius = '8px';
                    }
                } else if (icon.parentNode) {
                    // 如果是其他元素，尝试移除
                    icon.innerHTML = '';
                    icon.parentNode.removeChild(icon);
                }
            });
        }
        
        // 移除所有emoji图标
        const allEmojis = document.querySelectorAll('div[style*="fontSize: 3rem"]');
        if (allEmojis.length > 0) {
            allEmojis.forEach(emoji => {
                if (emoji && emoji.parentNode) {
                    emoji.parentNode.removeChild(emoji);
                }
            });
        }
    }, 2000);
}); 