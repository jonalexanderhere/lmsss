import { Controller, Get, HttpCode, Header } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get("favicon.ico")
  @HttpCode(204)
  getFavicon() {
    return;
  }

  @Get()
  @Header('Content-Type', 'text/html')
  getHello() {
    const frontendUrl = this.configService.get<string>("FRONTEND_URL") || "https://lmsss.vercel.app";
    
    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>NetClassix | API Backend Hub</title>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  background-color: #0f172a;
                  color: #f8fafc;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  overflow: hidden;
              }
              .container {
                  text-align: center;
                  background: rgba(30, 41, 59, 0.7);
                  backdrop-filter: blur(12px);
                  padding: 3rem;
                  border-radius: 2rem;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                  max-width: 500px;
                  width: 90%;
                  animation: fadeIn 0.8s ease-out;
              }
              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .logo {
                  font-size: 2.5rem;
                  font-weight: 700;
                  background: linear-gradient(to right, #2dd4bf, #3b82f6);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  margin-bottom: 0.5rem;
              }
              .badge {
                  background: rgba(45, 212, 191, 0.1);
                  color: #2dd4bf;
                  padding: 0.25rem 0.75rem;
                  border-radius: 1rem;
                  font-size: 0.75rem;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
              }
              h1 { margin: 1.5rem 0 0.5rem; font-size: 1.5rem; }
              p { color: #94a3b8; line-height: 1.6; margin-bottom: 2rem; }
              .btn {
                  display: inline-block;
                  background: linear-gradient(to right, #2dd4bf, #3b82f6);
                  color: white;
                  text-decoration: none;
                  padding: 1rem 2rem;
                  border-radius: 1rem;
                  font-weight: 600;
                  transition: all 0.3s ease;
                  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
              }
              .btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
                  filter: brightness(1.1);
              }
              .footer {
                  margin-top: 2rem;
                  font-size: 0.75rem;
                  color: #475569;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">NetClassix</div>
              <span class="badge">API Backend Engine</span>
              <h1>Mesin Berjalan Lancar</h1>
              <p>Ini adalah alamat layanan Backend. Untuk mengakses Dashboard Pengguna, silakan klik tombol di bawah ini.</p>
              <a href="${frontendUrl}" class="btn">Buka Dashboard Utama</a>
              <div class="footer">
                  NetClassix v1.0.0 &bull; SMK Negeri 1 Liwa &bull; TJKT
              </div>
          </div>
      </body>
      </html>
    `;
  }
}
