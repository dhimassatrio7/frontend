# Menggunakan Nginx untuk menyajikan file statis
FROM nginx:alpine

# Direktori kerja dalam container
WORKDIR /usr/share/nginx/html

# Salin hasil build React Vite ke direktori kerja
COPY dist/ .

# Expose port 80 untuk akses HTTP
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
