# fs-be-node-project
Install Nginx:

bash
Copy
sudo apt update && sudo apt install nginx -y
Start & enable Nginx:

bash
Copy
sudo systemctl start nginx
sudo systemctl enable nginx
Verify it’s running:

bash
Copy
curl http://localhost

Step 3: Upload Your HTML Files
Create a directory for your website:

bash
Copy
sudo mkdir -p /var/www/yourdomain/html
Set correct permissions:

bash
Copy
sudo chown -R $USER:$USER /var/www/yourdomain/html
sudo chmod -R 755 /var/www
Upload your HTML file (e.g., index.html):

Option 1: Use scp (from your local machine):

bash
Copy
scp /path/to/index.html root@your_vps_ip:/var/www/yourdomain/html/
Option 2: Manually create a file:

bash
Copy
sudo nano /var/www/yourdomain/html/index.html
Paste your HTML code (example):

html
Copy
<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>

Step 4: Configure the Web Server
For Nginx
Create a config file:

bash
Copy
sudo nano /etc/nginx/sites-available/yourdomain
Paste this (replace yourdomain with your actual domain or IP):

nginx
Copy
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/yourdomain/html;
    index index.html;
}
Enable the site:

bash
Copy
sudo ln -s /etc/nginx/sites-available/yourdomain /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl restart nginx

Optional: Secure with HTTPS (SSL)
Install Certbot (Let’s Encrypt):

bash
Copy
sudo apt install certbot python3-certbot-nginx -y  # For Nginx
# OR
sudo apt install certbot python3-certbot-apache -y  # For Apache
Run Certbot:

bash
Copy
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
(Follow prompts to enable HTTPS.)


