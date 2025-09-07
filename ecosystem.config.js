module.exports = {
  apps: [
    {
      name: "bot-gendarmerie",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production"
      },
      watch: false,          // laisse false en prod
      autorestart: true,
      max_memory_restart: "300M"
    }
  ]
}