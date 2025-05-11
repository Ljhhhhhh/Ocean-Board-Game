// 直接加载字体，绕过缓存
document.addEventListener('DOMContentLoaded', function() {
    console.log('直接加载字体文件');
    
    // 添加时间戳绕过缓存
    const timestamp = Date.now();
    
    // 定义字体文件
    const fontFiles = [
        'HindMadurai-Light.ttf',
        'HindMadurai-Regular.ttf',
        'HindMadurai-Medium.ttf', 
        'HindMadurai-SemiBold.ttf',
        'HindMadurai-Bold.ttf'
    ];
    
    // 创建并添加style元素
    const styleElement = document.createElement('style');
    
    // 为每种字体构建@font-face规则
    let fontFaceRules = '';
    
    fontFiles.forEach(fontFile => {
        const weight = fontFile.includes('Light') ? '300' : 
                      fontFile.includes('Regular') ? '400' :
                      fontFile.includes('Medium') ? '500' :
                      fontFile.includes('SemiBold') ? '600' : '700';
        
        fontFaceRules += `
            @font-face {
                font-family: 'Hind Madurai';
                src: url('${fontFile}?t=${timestamp}') format('truetype');
                font-weight: ${weight};
                font-style: normal;
                font-display: block;
            }
        `;
    });
    
    // 添加全局字体应用规则
    fontFaceRules += `
        * {
            font-family: 'Hind Madurai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
    `;
    
    // 设置style内容
    styleElement.textContent = fontFaceRules;
    
    // 添加到文档头部
    document.head.appendChild(styleElement);
    
    // 直接加载字体文件
    fontFiles.forEach(fontFile => {
        // 创建一个新的FontFace对象
        const font = new FontFace(
            'Hind Madurai',
            `url('${fontFile}?t=${timestamp}')`,
            { 
                weight: fontFile.includes('Light') ? '300' : 
                        fontFile.includes('Regular') ? '400' :
                        fontFile.includes('Medium') ? '500' :
                        fontFile.includes('SemiBold') ? '600' : '700' 
            }
        );
        
        // 加载字体
        font.load().then(function(loadedFont) {
            // 添加到字体集合
            document.fonts.add(loadedFont);
            console.log(`字体加载成功: ${fontFile}`);
            
            // 通知文档字体已更新
            document.documentElement.style.fontFamily = 'Hind Madurai, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        }).catch(function(error) {
            console.error(`字体加载失败: ${fontFile}`, error);
        });
    });
    
    // 强制更新页面样式
    setTimeout(() => {
        document.body.style.fontFamily = 'Hind Madurai, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        
        // 尝试触发重排来应用新字体
        document.body.style.opacity = '0.99';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 10);
    }, 100);
}); 