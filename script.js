/**
 * Smarty Bubbles - 主JavaScript文件
 * 功能：
 * 1. 响应式导航菜单
 * 2. 平滑滚动
 * 3. 气泡动画效果
 * 4. 全局泡泡背景效果
 */

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const gameFrame = document.getElementById('game-frame');
    const loadingIndicator = document.getElementById('game-loading');
    const navLinks = document.querySelectorAll('.main-nav a');
    const nav = document.querySelector('.main-nav');
    const mobileWidth = 768; // 移动设备断点

    // 游戏加载指示器处理
    if (gameFrame && loadingIndicator) {
        // 当iframe加载完成时隐藏加载指示器
        gameFrame.addEventListener('load', function() {
            // 稍微延长加载显示时间，确保代理页面有充分时间加载游戏
            setTimeout(function() {
                loadingIndicator.style.opacity = '0';
                setTimeout(function() {
                    loadingIndicator.style.display = 'none';
                }, 300);
            }, 1200); // 延长时间，确保代理页面和游戏都已加载
        });
        
        // 监听来自代理页面的消息
        window.addEventListener('message', function(event) {
            // 如果收到游戏加载完成的消息，隐藏加载指示器
            if (event.data && event.data.type === 'gameLoaded') {
                loadingIndicator.style.opacity = '0';
                setTimeout(function() {
                    loadingIndicator.style.display = 'none';
                }, 300);
            }
        });
        
        // 添加点击处理，确保游戏区域接收到点击事件
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.addEventListener('click', function() {
                // 尝试聚焦iframe，这有助于确保游戏接收输入
                if (gameFrame && document.activeElement !== gameFrame) {
                    gameFrame.focus();
                }
            });
        }
    }

    // 响应式导航菜单
    function createMobileMenu() {
        if (window.innerWidth <= mobileWidth && !document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle Menu');
            
            // 插入到导航之前
            nav.parentNode.insertBefore(menuToggle, nav);
            
            // 添加点击事件来切换菜单
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.innerHTML = nav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // 点击导航链接后关闭菜单
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= mobileWidth) {
                        nav.classList.remove('active');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            });
        } else if (window.innerWidth > mobileWidth) {
            // 移除移动菜单按钮
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
            }
            nav.classList.remove('active');
        }
    }

    // 平滑滚动到锚点
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 滚动到目标元素
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 减去头部高度的偏移
                    behavior: 'smooth'
                });
                
                // 更新URL但不刷新页面
                history.pushState(null, null, targetId);
            }
        });
    });

    // 添加CSS样式为移动菜单按钮
    const style = document.createElement('style');
    style.textContent = `
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--dark-color);
            cursor: pointer;
        }
        
        @media (max-width: ${mobileWidth}px) {
            .menu-toggle {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);

    // 初始化和窗口调整时创建/移除移动菜单
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // 滚动时添加头部阴影
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // 创建全局泡泡背景动画
    function createGlobalBubbles() {
        const bubbleBg = document.querySelector('.bubble-bg');
        if (!bubbleBg) return;
        
        // 清除现有泡泡
        bubbleBg.innerHTML = '';
        
        // 创建新泡泡，数量根据屏幕大小调整
        const bubbleCount = window.innerWidth <= mobileWidth ? 8 : 12;
        
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubbleBg.appendChild(bubble);
        }
    }
    
    // 装饰性气泡随机大小和位置
    const createRandomBubbles = () => {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // 移除现有的随机气泡
        document.querySelectorAll('.random-bubble').forEach(bubble => bubble.remove());
        
        // 创建新的随机气泡
        for (let i = 0; i < 10; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble random-bubble';
            
            // 随机大小
            const size = Math.random() * 60 + 20;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // 随机颜色 - 使用预定义的主题颜色
            const colors = [
                'rgba(255, 107, 107, 0.7)',
                'rgba(254, 202, 87, 0.7)',
                'rgba(38, 222, 129, 0.7)',
                'rgba(87, 101, 242, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ];
            bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机位置
            bubble.style.top = `${Math.random() * 100}%`;
            bubble.style.right = `${Math.random() * 100}%`;
            
            // 随机动画延迟
            bubble.style.animationDelay = `${Math.random() * 5}s`;
            
            // 添加到英雄区域
            heroSection.appendChild(bubble);
        }
    };

    // 添加交互式泡泡效果 - 鼠标移动创建泡泡
    function addMouseBubbleEffect() {
        const body = document.body;
        let timeout;
        
        // 在鼠标移动时创建泡泡
        body.addEventListener('mousemove', function(e) {
            // 限制创建频率，提高性能
            if (timeout) clearTimeout(timeout);
            
            timeout = setTimeout(function() {
                // 只在非游戏区域创建泡泡，避免干扰游戏
                const gameSection = document.querySelector('.game-section');
                const rect = gameSection ? gameSection.getBoundingClientRect() : null;
                
                if (rect && 
                    (e.clientY < rect.top || 
                     e.clientY > rect.bottom || 
                     e.clientX < rect.left || 
                     e.clientX > rect.right)) {
                    createMouseBubble(e.clientX, e.clientY);
                }
            }, 150); // 限制创建频率
        }, { passive: true });
    }
    
    // 创建跟随鼠标的泡泡
    function createMouseBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.className = 'mouse-bubble';
        
        // 设置泡泡样式
        const size = Math.random() * 20 + 10;
        const colors = [
            'var(--bubble-color-1)',
            'var(--bubble-color-2)',
            'var(--bubble-color-3)',
            'var(--bubble-color-4)',
            'var(--bubble-color-5)'
        ];
        
        Object.assign(bubble.style, {
            position: 'fixed',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${x - size/2}px`,
            top: `${y - size/2}px`,
            pointerEvents: 'none',
            zIndex: '2',
            opacity: '0.7',
            transition: 'transform 0.8s ease, opacity 0.8s ease',
            transform: 'scale(1)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        });
        
        document.body.appendChild(bubble);
        
        // 淡出动画
        setTimeout(() => {
            bubble.style.transform = `scale(1.5) translate(${Math.random() * 40 - 20}px, ${-30 - Math.random() * 30}px)`;
            bubble.style.opacity = '0';
        }, 50);
        
        // 移除DOM元素
        setTimeout(() => {
            document.body.removeChild(bubble);
        }, 850);
    }

    // 初始化所有气泡效果
    createGlobalBubbles();
    createRandomBubbles();
    addMouseBubbleEffect();
    
    // 窗口调整时重新创建气泡
    window.addEventListener('resize', function() {
        createGlobalBubbles();
        createRandomBubbles();
    });
    
    // 为标题添加泡泡图标动画效果
    const titleBubbles = document.querySelectorAll('.section-title-bubble');
    titleBubbles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            // 添加弹性动画
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1.05)';
        });
        
        title.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}); 