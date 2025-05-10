# **EduChain - Образовательная блокчейн-платформа**  
**Разработка системы учета академических достижений студентов на основе технологии блокчейн**  

Проект состоит из трех основных компонентов:  
- **Смарт-контракт** (Solidity, Hardhat, Ganache)  
- **Бэкенд** (Node.js, Express)  
- **Фронтенд** (React + TypeScript + Vite)  

## **🚀 Быстрый старт**  
Следуйте инструкциям, чтобы развернуть проект локально.  

### **Необходимые компоненты**  
- **Node.js** (v18+) - [Скачать здесь](https://nodejs.org/en)
- **Npm**  
- **Ganache** (Desktop версия) – [Скачать здесь](https://archive.trufflesuite.com/ganache/)  

---

## **🔧 Установка и настройка**  

### **1. Клонирование репозитория**  
```bash
git clone https://github.com/Goratsy/EduChain
cd educhain
```

### **2. Настройка смарт-контрактов**  
1. **Установка зависимостей**  
   ```bash
   cd smart_contract
   npm install
   ```
2. **Настройка `.env`**  
   - Переименуйте `.env example` в `.env`  
   - Переназначте переменным нужные значения.  

3. **Запуск Ganache**  
   - Откройте Ganache Desktop и создайте workspace.  
   - Используйте стандартный RPC-URL (`http://127.0.0.1:7545`).  

4. **Компиляция и деплой контрактов**  
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network development
   ```
   - Скопируйте адрес контракта для бэкенда.  

### **3. Настройка бэкенда**  
1. **Установка зависимостей**  
   ```bash
   cd ../backend
   npm install
   ```
2. **Настройка `.env`**  
   - Переименуйте `.env example` в `.env`  
   - Укажите `PORT`, и адрес контракта.  

3. **Запуск сервера**  
   ```bash
   npm start
   ```
   - Сервер запустится на `http://localhost:****`.  

### **4. Настройка фронтенда**  
1. **Установка зависимостей**  
   ```bash
   cd ../frontend/educhain
   npm install
   ```
2. **Настройка `.env`**  
   - Переименуйте `.env example` в `.env`  
   - Укажите локальный адрес бэкенда.  

3. **Запуск фронтенда**  
   ```bash
   npm run dev
   ```
   - Приложение откроется на `http://localhost:5173`.  

---

## **📂 Структура проекта**  

### **1. `smart_contract/`**  
- **`contracts/`** – Solidity-контракты (`EduChain.sol`).  
- **`scripts/`** – Скрипты деплоя (`deploy.js`).  
- **`test/`** – Тесты Hardhat.  
- **`artifacts/` и `cache/`** – Скомпилированные контракты (автогенерация).  

### **2. `backend/`**  
- **`index.js`** – Основной сервер на Express.  
- **`openapi/`** – Спецификация API (Swagger/OpenAPI).  
- **`utils/`** – Вспомогательные функции.  

### **3. `frontend/educhain/`**  
- **`src/controllers/`** – Запросы к API.  
- **`src/pages/`** – Страницы React.  
- **`src/shared/`** – Используемые UI-компоненты.  

---

## **🔌 Не забудьте про переменные окружения**  
В каждой папке (`backend`, `frontend`, `smart_contract`) есть файл **`.env.example`**.  
- **Переименуйте его в `.env`** и заполните необходимыми значениями.  

---

**🎉 Готово!** Теперь вы можете тестировать и развивать EduChain! 🚀  
