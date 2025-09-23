# 天气 API 使用指南

## 概述
这个 Node Function 提供了获取用户位置天气信息的功能，使用 OpenWeatherMap 免费 API。

## 🔑 API Key 设置

### 1. 申请免费 API Key
1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 点击 "Sign Up" 注册账户
3. 登录后进入 [API Keys 页面](https://home.openweathermap.org/api_keys)
4. 复制你的 API Key

### 2. 设置环境变量
在你的 EdgeOne Pages 项目中设置环境变量：
```
OPENWEATHER_API_KEY=你的API密钥
```

## 📡 API 使用方法

### GET 请求
通过 URL 参数获取天气信息：

#### 通过城市名称查询
```
GET /weather?city=北京
GET /weather?city=Beijing&lang=en
```

#### 通过经纬度查询
```
GET /weather?lat=39.9042&lon=116.4074
GET /weather?lat=39.9042&lon=116.4074&lang=zh_cn
```

### POST 请求
通过请求体发送参数：

```javascript
// 通过城市名称
fetch('/weather', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    city: '上海',
    lang: 'zh_cn'
  })
})

// 通过经纬度
fetch('/weather', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    lat: 31.2304,
    lon: 121.4737,
    lang: 'zh_cn'
  })
})
```

## 📋 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `city` | string | 否* | 城市名称（中文或英文） |
| `lat` | number | 否* | 纬度 |
| `lon` | number | 否* | 经度 |
| `lang` | string | 否 | 语言代码，默认 `zh_cn` |

*注：`city` 或 `lat`+`lon` 必须提供其中一组

### 支持的语言代码
- `zh_cn` - 简体中文
- `en` - 英语
- `ja` - 日语
- `ko` - 韩语
- `fr` - 法语
- `de` - 德语

## 📊 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    "location": "北京",
    "country": "CN",
    "temperature": 25,
    "feelsLike": 27,
    "humidity": 60,
    "pressure": 1013,
    "visibility": 10,
    "windSpeed": 3.5,
    "windDirection": 180,
    "weather": {
      "main": "Clear",
      "description": "晴",
      "icon": "01d"
    },
    "sunrise": "2025-09-12T21:45:00.000Z",
    "sunset": "2025-09-13T10:15:00.000Z",
    "timezone": 28800
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "请提供城市名称 (city) 或经纬度 (lat, lon) 参数"
}
```

## 🌟 使用示例

### 前端 JavaScript 示例
```javascript
// 获取北京天气
async function getBeijingWeather() {
  try {
    const response = await fetch('/weather?city=北京');
    const data = await response.json();
    
    if (data.success) {
      console.log(`${data.data.location}: ${data.data.temperature}°C`);
      console.log(`天气: ${data.data.weather.description}`);
      console.log(`体感温度: ${data.data.feelsLike}°C`);
    } else {
      console.error('获取天气失败:', data.error);
    }
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 通过用户位置获取天气
async function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(`/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        
        if (data.success) {
          displayWeather(data.data);
        }
      } catch (error) {
        console.error('获取天气失败:', error);
      }
    });
  }
}

function displayWeather(weather) {
  document.getElementById('location').textContent = weather.location;
  document.getElementById('temperature').textContent = `${weather.temperature}°C`;
  document.getElementById('description').textContent = weather.weather.description;
  document.getElementById('humidity').textContent = `湿度: ${weather.humidity}%`;
  document.getElementById('wind').textContent = `风速: ${weather.windSpeed} m/s`;
}
```

### React 组件示例
```jsx
import { useState, useEffect } from 'react';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch('/weather?city=北京');
      const data = await response.json();
      
      if (data.success) {
        setWeather(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('获取天气信息失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!weather) return null;

  return (
    <div className="weather-widget">
      <h3>{weather.location}, {weather.country}</h3>
      <div className="temperature">{weather.temperature}°C</div>
      <div className="description">{weather.weather.description}</div>
      <div className="details">
        <span>体感: {weather.feelsLike}°C</span>
        <span>湿度: {weather.humidity}%</span>
        <span>风速: {weather.windSpeed} m/s</span>
      </div>
    </div>
  );
}
```

## 🚀 部署说明

1. 确保在 EdgeOne Pages 项目中设置了 `OPENWEATHER_API_KEY` 环境变量
2. 将 `weather.ts` 文件放在 `node-functions/` 目录下
3. 部署后可通过 `/weather` 路径访问

## 📝 注意事项

- OpenWeatherMap 免费版每月限制 1000 次调用
- API Key 需要激活后才能使用（通常几分钟内生效）
- 建议在生产环境中添加请求频率限制
- 支持 CORS，可以从前端直接调用

## 🔧 故障排除

### 常见错误
1. **"请设置 OPENWEATHER_API_KEY 环境变量"**
   - 检查环境变量是否正确设置

2. **"Invalid API key"**
   - 确认 API Key 是否正确
   - 检查 API Key 是否已激活

3. **"city not found"**
   - 检查城市名称拼写
   - 尝试使用英文城市名

4. **请求超时**
   - 检查网络连接
   - OpenWeatherMap 服务可能暂时不可用