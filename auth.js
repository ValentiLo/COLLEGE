// auth.js
class AuthPage {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkRememberedUser();
    }

    setupEventListeners() {
        // Форма входа
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Переключение видимости пароля
        const passwordToggle = document.getElementById('passwordToggle');
        passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());

        // Социальные кнопки
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e.target));
        });

        // Валидация в реальном времени
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        emailInput.addEventListener('blur', () => this.validateEmail());
        passwordInput.addEventListener('blur', () => this.validatePassword());
    }

    handleLogin(e) {
        e.preventDefault();
        
        if (this.isLoading) return;

        // Валидация формы
        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        // Сбор данных формы
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            rememberMe: document.getElementById('rememberMe').checked
        };

        // Имитация запроса к API
        this.loginUser(formData);
    }

    async loginUser(formData) {
        try {
            // Имитация задержки сети
            await this.delay(1500);

            // В реальном приложении здесь будет fetch запрос
            const response = await this.mockLoginAPI(formData);

            if (response.success) {
                this.handleLoginSuccess(response.user, formData.rememberMe);
            } else {
                this.handleLoginError(response.message);
            }
        } catch (error) {
            this.handleLoginError('Произошла ошибка при входе. Попробуйте еще раз.');
        } finally {
            this.setLoading(false);
        }
    }

    async mockLoginAPI(formData) {
        // Имитация ответа сервера
        // В реальном приложении здесь будет работа с реальным API

        // Проверка тестовых учетных данных
        const testUsers = [
            { email: 'demo@example.com', password: 'password123', name: 'Демо Пользователь' },
            { email: 'admin@example.com', password: 'admin123', name: 'Администратор' }
        ];

        const user = testUsers.find(u => 
            u.email === formData.email && u.password === formData.password
        );

        if (user) {
            return {
                success: true,
                user: {
                    id: 1,
                    name: user.name,
                    email: user.email,
                    avatar: null
                },
                token: 'mock_jwt_token_here'
            };
        } else {
            return {
                success: false,
                message: 'Неверный email или пароль'
            };
        }
    }

    handleLoginSuccess(user, rememberMe) {
        // Сохранение данных пользователя
        this.saveUserData(user, rememberMe);
        
        // Показ сообщения об успехе
        this.showAlert('Вход выполнен успешно! Перенаправляем...', 'success');
        
        // Имитация перенаправления
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }

    handleLoginError(message) {
        this.showAlert(message, 'error');
    }

    validateForm() {
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        return isEmailValid && isPasswordValid;
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('emailError');
        const email = emailInput.value.trim();

        if (!email) {
            this.showFieldError(emailInput, errorElement, 'Email обязателен для заполнения');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showFieldError(emailInput, errorElement, 'Введите корректный email адрес');
            return false;
        }

        this.clearFieldError(emailInput, errorElement);
        return true;
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const errorElement = document.getElementById('passwordError');
        const password = passwordInput.value;

        if (!password) {
            this.showFieldError(passwordInput, errorElement, 'Пароль обязателен для заполнения');
            return false;
        }

        if (password.length < 6) {
            this.showFieldError(passwordInput, errorElement, 'Пароль должен содержать минимум 6 символов');
            return false;
        }

        this.clearFieldError(passwordInput, errorElement);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
    }

    clearFieldError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('passwordToggle');
        const icon = toggleButton.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
            toggleButton.setAttribute('aria-label', 'Скрыть пароль');
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
            toggleButton.setAttribute('aria-label', 'Показать пароль');
        }
    }

    handleSocialLogin(button) {
        const provider = button.classList[1].replace('btn-', '');
        
        this.showAlert(`Вход через ${this.getProviderName(provider)}...`, 'info');
        
        // В реальном приложении здесь будет OAuth авторизация
        console.log(`Social login: ${provider}`);
        
        // Имитация социального входа
        setTimeout(() => {
            this.showAlert('Функция социального входа находится в разработке', 'warning');
        }, 1000);
    }

    getProviderName(provider) {
        const providers = {
            'google': 'Google',
            'vk': 'ВКонтакте',
            'yandex': 'Яндекс'
        };
        return providers[provider] || provider;
    }

    saveUserData(user, rememberMe) {
        const userData = {
            ...user,
            loginTime: new Date().toISOString()
        };

        if (rememberMe) {
            localStorage.setItem('bookstore_user', JSON.stringify(userData));
            localStorage.setItem('bookstore_token', 'mock_jwt_token_here');
        } else {
            sessionStorage.setItem('bookstore_user', JSON.stringify(userData));
            sessionStorage.setItem('bookstore_token', 'mock_jwt_token_here');
        }
    }

    checkRememberedUser() {
        const savedUser = localStorage.getItem('bookstore_user') || sessionStorage.getItem('bookstore_user');
        
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                document.getElementById('email').value = user.email;
                document.getElementById('rememberMe').checked = true;
            } catch (error) {
                console.error('Error parsing saved user data:', error);
            }
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    showAlert(message, type = 'info') {
        const alertsContainer = document.getElementById('authAlerts');
        const alertId = 'alert-' + Date.now();

        const alert = document.createElement('div');
        alert.className = `auth-alert ${type}`;
        alert.id = alertId;
        alert.innerHTML = `
            <i class="fas ${this.getAlertIcon(type)}"></i>
            <span>${message}</span>
        `;

        alertsContainer.appendChild(alert);

        // Автоматическое скрытие для success и info сообщений
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                this.removeAlert(alertId);
            }, 5000);
        }
    }

    getAlertIcon(type) {
        const icons = {
            'error': 'fa-exclamation-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    removeAlert(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AuthPage();
});