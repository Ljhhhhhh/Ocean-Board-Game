// 强制刷新字体加载
(function() {
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    
    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'Hind Madurai';
            src: url('HindMadurai-Light.ttf?t=${timestamp}') format('truetype');
            font-weight: 300;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'Hind Madurai';
            src: url('HindMadurai-Regular.ttf?t=${timestamp}') format('truetype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'Hind Madurai';
            src: url('HindMadurai-Medium.ttf?t=${timestamp}') format('truetype');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'Hind Madurai';
            src: url('HindMadurai-SemiBold.ttf?t=${timestamp}') format('truetype');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'Hind Madurai';
            src: url('HindMadurai-Bold.ttf?t=${timestamp}') format('truetype');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
        }
        
        * {
            font-family: 'Hind Madurai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(style);
    
    // 预加载所有字体文件确保立即加载
    const fonts = [
        'HindMadurai-Light.ttf',
        'HindMadurai-Regular.ttf',
        'HindMadurai-Medium.ttf',
        'HindMadurai-SemiBold.ttf',
        'HindMadurai-Bold.ttf'
    ];
    
    fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = `${font}?t=${timestamp}`;
        link.as = 'font';
        link.type = 'font/ttf';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
})(); 