# Gif Countdown Generator
This app generate countdown GIF's for websites, newsletters, etc.

This app has been cloned and extended from this repository: https://github.com/raindigi/animinated-date-gif.git.

# Extended Functions
- Visual interface to generate links
- Added font size and font family to parameters

# Preview
<img width="750" height="500" src="https://github.com/CaioAFA/node-countdown-gif-generator/blob/master/app-preview.png?raw=true">

# Executing the project
```bash
# Install dependencies
npm install

# Execute the app
node app.js

# Access http://localhost:3010/
```

# Executing the project - Docker
```bash
# Running attached in terminal
npm run start-docker

# Running dettached from terminal
docker-compose up -d # Remove -d for debug

# Stop the container dettached from terminal
docker-compose down
```

# Requisites
This project extended function was tested and developed using these versions:

- NodeJS: 8.11.2
- Cairo: 1.8.6
            
## License

MIT & GNU GENERAL PUBLIC LICENSE 3.0
