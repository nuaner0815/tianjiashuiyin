class WatermarkCamera {
    constructor() {
        this.originalImage = null;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.previewImage = document.getElementById('previewImage');
        
        this.initializeElements();
        this.bindEvents();
        this.setDefaultDateTime();
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
            this.handleFile(files[0]);
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
        const position = this.watermarkPosition.value;
        const size = this.watermarkSize.value;
        
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
        
        // 格式化日期时间
        const dateObj = new Date(date + 'T' + time);
        const formattedDate = dateObj.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.');
        
        const formattedTime = time;
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
        const watermarkHeight = lineHeight * 3 + padding; // 改为3行
        
        // 计算位置
        let x, y;
        const margin = 30;
        
        switch (position) {
            case 'top-left':
                x = margin;
                y = margin;
                break;
            case 'top-right':
                x = this.canvas.width - watermarkWidth - margin;
                y = margin;
                break;
            case 'bottom-left':
                x = margin;
                y = this.canvas.height - watermarkHeight - margin;
                break;
            case 'bottom-right':
            default:
                x = this.canvas.width - watermarkWidth - margin;
                y = this.canvas.height - watermarkHeight - margin;
                break;
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