class WatermarkCamera {
    constructor() {
        this.originalImage = null;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.previewImage = document.getElementById('previewImage');
        
        this.initializeElements();
        this.bindEvents();
        this.setDefaultDateTime();
        // 初始化渐变设置显示状态
        this.toggleGradientSettings();
    }

    initializeElements() {
        this.imageInput = document.getElementById('imageInput');
        this.uploadPreviewArea = document.getElementById('uploadPreviewArea');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImage = document.getElementById('previewImage');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dateInput = document.getElementById('dateInput');
        this.timeInput = document.getElementById('timeInput');
        this.locationInput = document.getElementById('locationInput');
        this.watermarkPosition = document.getElementById('watermarkPosition');
        this.watermarkSize = document.getElementById('watermarkSize');
        this.watermarkBackground = document.getElementById('watermarkBackground');
        this.gradientColorSettings = document.getElementById('gradientColorSettings');
        this.gradientStartColor = document.getElementById('gradientStartColor');
        this.gradientEndColor = document.getElementById('gradientEndColor');
        this.gradientStartOpacity = document.getElementById('gradientStartOpacity');
        this.gradientEndOpacity = document.getElementById('gradientEndOpacity');
        this.startOpacityValue = document.getElementById('startOpacityValue');
        this.endOpacityValue = document.getElementById('endOpacityValue');
        this.addWatermarkBtn = document.getElementById('addWatermarkBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.selectBtn = document.getElementById('selectBtn');
    }

    bindEvents() {
        // 文件上传事件
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 选择按钮事件
        this.selectBtn.addEventListener('click', () => this.imageInput.click());
        
        // 拖拽上传事件
        this.uploadPreviewArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadPreviewArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadPreviewArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadPreviewArea.addEventListener('dragenter', (e) => this.handleDragEnter(e));

        // 按钮事件
        this.addWatermarkBtn.addEventListener('click', () => this.addWatermark());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.resetBtn.addEventListener('click', () => this.reset());

        // 输入变化事件
        [this.dateInput, this.timeInput, this.locationInput].forEach(input => {
            input.addEventListener('input', () => this.checkFormValidity());
        });

        // 背景类型变化事件
        this.watermarkBackground.addEventListener('change', () => this.toggleGradientSettings());

        // 渐变颜色设置事件
        this.gradientStartOpacity.addEventListener('input', () => {
            this.startOpacityValue.textContent = this.gradientStartOpacity.value + '%';
        });
        
        this.gradientEndOpacity.addEventListener('input', () => {
            this.endOpacityValue.textContent = this.gradientEndOpacity.value + '%';
        });
    }

    toggleGradientSettings() {
        if (this.watermarkBackground.value === 'gradient') {
            this.gradientColorSettings.classList.add('show');
        } else {
            this.gradientColorSettings.classList.remove('show');
        }
    }

    setDefaultDateTime() {
        const now = new Date();
        this.dateInput.value = now.toISOString().split('T')[0];
        this.timeInput.value = now.toTimeString().slice(0, 5);
    }

    handleDragEnter(e) {
        e.preventDefault();
        this.uploadPreviewArea.classList.add('dragover');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragLeave(e) {
        e.preventDefault();
        if (!this.uploadPreviewArea.contains(e.relatedTarget)) {
            this.uploadPreviewArea.classList.remove('dragover');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadPreviewArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]); // 修正：使用processFile而不是handleFile
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    loadImage(src) {
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            this.previewImage.src = src;
            this.uploadPlaceholder.style.display = 'none';
            this.imagePreview.style.display = 'flex';
            this.checkFormValidity();
        };
        img.src = src;
    }

    checkFormValidity() {
        const isValid = this.originalImage && 
                       this.dateInput.value && 
                       this.timeInput.value && 
                       this.locationInput.value.trim();
        
        this.addWatermarkBtn.disabled = !isValid;
    }

    addWatermark() {
        if (!this.originalImage) return;

        // 设置canvas尺寸
        this.canvas.width = this.originalImage.width;
        this.canvas.height = this.originalImage.height;

        // 绘制原图
        this.ctx.drawImage(this.originalImage, 0, 0);

        // 添加水印
        this.drawWatermark();

        // 更新预览
        this.previewImage.src = this.canvas.toDataURL();
        this.downloadBtn.disabled = false;
    }

    drawWatermark() {
        const size = this.watermarkSize.value;
        const position = this.watermarkPosition.value;
        const backgroundType = this.watermarkBackground.value;
        
        // 新的水印样式配置 - 更大字体和更宽行距
        const sizeConfig = {
            small: { 
                fontSize: 28, 
                padding: 20, 
                iconSize: 32,
                lineSpacing: 15
            },
            medium: { 
                fontSize: 36, 
                padding: 25, 
                iconSize: 40,
                lineSpacing: 18
            },
            large: { 
                fontSize: 44, 
                padding: 30, 
                iconSize: 48,
                lineSpacing: 22
            }
        };
        
        const config = sizeConfig[size];
        const fontSize = config.fontSize;
        const padding = config.padding;
        const iconSize = config.iconSize;
        const lineSpacing = config.lineSpacing;
        
        // 创建水印内容
        const date = this.dateInput.value;
        const time = this.timeInput.value;
        const location = this.locationInput.value;
        
        if (!date || !time || !location) return;
        
        // 设置字体
        this.ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // 使用当前时间来显示实时秒数
        const now = new Date();
        const dateObj = new Date(date + 'T' + time);
        
        // 格式化日期（使用用户输入的日期）
        const formattedDate = dateObj.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.');
        
        // 格式化时间（使用当前时间的秒数，但保持用户设置的小时和分钟）
        const userHour = dateObj.getHours();
        const userMinute = dateObj.getMinutes();
        const currentSecond = now.getSeconds();
        
        const formattedTime = `${userHour.toString().padStart(2, '0')}:${userMinute.toString().padStart(2, '0')}:${currentSecond.toString().padStart(2, '0')}`;
        
        const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][dateObj.getDay()];
        
        // 计算文本尺寸
        const dateTimeText = `${formattedDate} ${formattedTime}`;
        const weekdayText = weekday;
        const locationText = location;
        
        // 测量图标宽度以确保对齐
        this.ctx.font = `${fontSize - 4}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        const iconWidth = Math.max(
            this.ctx.measureText('🕐').width,
            this.ctx.measureText('📅').width,
            this.ctx.measureText('📍').width
        );
        
        // 测量文本宽度
        const dateTimeWidth = iconWidth + this.ctx.measureText(` ${dateTimeText}`).width;
        const weekdayWidth = iconWidth + this.ctx.measureText(` ${weekdayText}`).width;
        const locationWidth = iconWidth + this.ctx.measureText(` ${locationText}`).width;
        
        const maxTextWidth = Math.max(dateTimeWidth, weekdayWidth, locationWidth);
        const lineHeight = fontSize + lineSpacing;
        const watermarkWidth = maxTextWidth + padding * 2 + 15; // 橙色竖线和间距
        const watermarkHeight = lineHeight * 3 + padding; // 3行主要内容
        
        // 计算位置 - 动态调整边距
        let x, y;
        const baseMargin = 30;
        const adjustedMargin = 60; // 调整后的边距，让水印更靠近中心
        
        switch (position) {
            case 'top-left':
                x = baseMargin;
                y = adjustedMargin; // 上方位置下移
                break;
            case 'top-right':
                x = this.canvas.width - watermarkWidth - baseMargin;
                y = adjustedMargin; // 上方位置下移
                break;
            case 'bottom-left':
                x = baseMargin;
                y = this.canvas.height - watermarkHeight - adjustedMargin; // 下方位置上移
                break;
            case 'bottom-right':
            default:
                x = this.canvas.width - watermarkWidth - baseMargin;
                y = this.canvas.height - watermarkHeight - adjustedMargin; // 下方位置上移
                break;
        }
        
        // 绘制水印背景（如果启用）
        if (backgroundType === 'gradient') {
            // 获取用户自定义的颜色和透明度
            const startColor = this.gradientStartColor.value;
            const endColor = this.gradientEndColor.value;
            const startOpacity = this.gradientStartOpacity.value / 100;
            const endOpacity = this.gradientEndOpacity.value / 100;
            
            // 将十六进制颜色转换为RGB
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            
            const startRgb = hexToRgb(startColor);
            const endRgb = hexToRgb(endColor);
            
            // 创建渐变背景
            const gradient = this.ctx.createLinearGradient(x, y, x + watermarkWidth, y + watermarkHeight);
            gradient.addColorStop(0, `rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${startOpacity})`);
            gradient.addColorStop(1, `rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${endOpacity})`);
            
            this.ctx.fillStyle = gradient;
            this.roundRect(this.ctx, x, y, watermarkWidth, watermarkHeight, 12);
            this.ctx.fill();
        }
        
        // 绘制橙色竖线
        const lineX = x + padding;
        const lineWidth = 6;
        this.ctx.fillStyle = '#FF9800'; // 橙色
        this.ctx.fillRect(lineX, y + padding, lineWidth, watermarkHeight - padding * 2);
        
        // 绘制文本 - 白色字体，透明背景
        const textX = lineX + lineWidth + 15;
        let textY = y + padding;
        
        // 添加文字阴影效果以提高可读性
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // 设置字体
        this.ctx.font = `${fontSize - 4}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = 'white';
        
        // 计算图标居中对齐的位置
        const iconCenterX = textX + iconWidth / 2;
        
        // 日期时间（带时钟图标）- 图标居中对齐
        const clockIconWidth = this.ctx.measureText('🕐').width;
        this.ctx.fillText('🕐', iconCenterX - clockIconWidth / 2, textY);
        this.ctx.fillText(dateTimeText, textX + iconWidth + 5, textY);
        textY += lineHeight;
        
        // 星期（带日历图标）- 图标居中对齐
        const calendarIconWidth = this.ctx.measureText('📅').width;
        this.ctx.fillText('📅', iconCenterX - calendarIconWidth / 2, textY);
        this.ctx.fillText(weekdayText, textX + iconWidth + 5, textY);
        textY += lineHeight;
        
        // 地点（带位置图标）- 图标居中对齐
        const locationIconWidth = this.ctx.measureText('📍').width;
        this.ctx.fillText('📍', iconCenterX - locationIconWidth / 2, textY);
        this.ctx.fillText(locationText, textX + iconWidth + 5, textY);
        
        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // 绘制独立的验证标识 - 与水印左边沿对齐
        const badgeX = x; // 与水印左边沿对齐
        const badgeY = y + watermarkHeight + 15; // 减少间距
        this.drawVerificationBadge(badgeX, badgeY, watermarkWidth);
    }
    
    drawVerificationBadge(x, y, maxWidth) {
        const verificationText = 'JN水印相机已验证';
        const shieldIcon = '';
        const fontSize = 28; // 进一步增大字体到28px
        
        // 设置字体
        this.ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        
        // 添加文字阴影效果
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        
        // 绘制文字（无背景）- 改为灰白色
        this.ctx.fillStyle = '#F5F5F5'; // 灰白色文字
        this.ctx.fillText(shieldIcon, x, y);
        
        const shieldIconWidth = this.ctx.measureText(shieldIcon).width;
        this.ctx.fillText(verificationText, x + shieldIconWidth + 5, y);
        
        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    downloadImage() {
        if (!this.canvas.width) return;
        
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `watermark-photo-${timestamp}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }

    reset() {
        this.imageInput.value = '';
        this.uploadPlaceholder.style.display = 'flex';
        this.imagePreview.style.display = 'none';
        this.previewImage.src = '';
        this.originalImage = null;
        this.addWatermarkBtn.disabled = true;
        this.downloadBtn.disabled = true;
        
        // 重置表单
        this.dateInput.value = '';
        this.timeInput.value = '';
        this.locationInput.value = '';
        this.watermarkPosition.value = 'bottom-left';
        this.watermarkSize.value = 'medium';
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new WatermarkCamera();
});