# menggunakan image node.js versi terbaru
FROM node:20-alpine AS build

# membuat direktori kerja di dalam container
WORKDIR /app

# menyalin file package.json dan package-lock.json ke direktori kerja
COPY package.json package-lock.json /app/

# menginstal dependensi
RUN npm install

# menyalin seluruh konten aplikasi ke direktori kerja
COPY . .

# membangun aplikasi
RUN npm run build

# menggunakan image Nginx
FROM nginx:alpine

# menyalin hasil build aplikasi dari stage sebelumnya ke direktori default Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# ekspor port 80
EXPOSE 80

# jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]