##########################################################################

# ubuntu 22.04.2 lts (jammy jellyfish) - minimal             #

##########################################################################

System information:

IP address:     5.252.227.22
Hostname:       v2202003115976111031.megasrv.de
root Passwort pyEuSExbNn2tW2R

SSH key fingerprints:

3072 SHA256:/QIy1QzmKk5hSN3JSvrlhfnFzYz5lJYmwEjbN9zKu2c (RSA)
256 SHA256:Pq+qoSb6qWB852L0BmdWN72DGZRb0SsefS5NwHCYZlc (ECDSA)
256 SHA256:Qpm1usdUIsKhKx5wuUygLIf4rsObiukoolSVFdw5DrU (ED25519)
3072 MD5:b0:d5:ac:c5:31:64:06:87:94:3a:68:2c:43:95:63:8b (RSA)
256 MD5:ae:5f:70:37:32:29:3e:16:7a:06:79:90:b9:e6:7c:8e (ECDSA)
256 MD5:2b:d9:eb:91:b8:f0:b7:63:da:8b:79:86:47:ca:7a:b5 (ED25519)

**User**  
postgres pw:Pinscher

**System updaten**  
`sudo apt-get update`  
`sudo apt-get upgrade` (?)

**SSH**  
`apt-get install openssh-server` (falls bereits installiert, passiert nix)  
`groupadd ssh`  
`sudo adduser --shell /bin/bash --ingroup 'ssh' {USER_NAME}`  
`usermod -aG sudo {USER_NAME}`  Muss root ausführen!(?) user in group "sudo" aufnehmen

`ssh-keygen -t rsa -b 4096` (auf Client mit Git-Bash/MING Bash)  
`ssh-copy-id -i ~/.ssh/mykey user@host` (auf Client mit Git-Bash/MING Bash)  
In SmarTTY auf open-ssh umstellen

**keine pw-eingabe bei sudo**
su root
touch /etc/sudoers.d/{USER_NAME}
chmod 0440 /etc/sudoers.d/{USER_NAME}
nano /etc/sudoers.d/{USER_NAME}
einfügen:
`# User privilege specification`
`{USER_NAME} ALL=NOPASSWD: ALL`

**Server absichern**  
`sudo nano /etc/ssh/sshd_config` (Datei öffnen)  
PasswordAuthentication no  
PubkeyAuthentication yes  
ChallengeResponseAuthentication no  
Port 28831 (ein freier Port)  
PerminRootLogin no  
AllowUsers {USER_NAME}

Hetzner: ????
Port 22
Protocol 2
AllowUsers user1 user2
LoginGraceTime 2m
PermitRootLogin no
StrictModes yes
MaxAuthTries 1
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
RhostsRSAAuthentication no
PasswordAuthentication no
PermitEmptyPasswords no
UsePAM yes

`sudo systemctl reload sshd`

**UFW Firewall**
`apt update`
`apt install ufw`
`ufw allow OpenSSH`
`ufw allow 28831`
`ufw enable`
`ufw status`

**Software**

`sudo apt install curl`

NGINX Server
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-debian-10
`sudo service apache2 stop`
`sudo apt-get install nginx`
`sudo systemctl enable nginx`
`sudo service nginx configtest` (test config)
oder `sudo nginx -t -c /etc/nginx/nginx.conf`
`cp /etc/nginx/sites-available/default /etc/nginx/sites-available/YOUR_SITE` duplicate default config  
`sudo ln -s /etc/nginx/sites-available/YOUR_SITE /etc/nginx/sites-enabled/`  enable a site

Remove an nginx Config from Sites-Enabled
`cd /etc/nginx/sites-enabled`
`sudo rm your-site-config`
`sudo service nginx reload`

`sudo systemctl restart nginx`

NodeJS
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-10

https://github.com/nodesource/distributions :
`curl -sL https://deb.nodesource.com/setup_13.x | sudo bash -`  
`sudo apt-get install -y nodejs`
`sudo apt install build-essential`

Yarn
`curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
`sudo apt-get update && sudo apt-get install yarn`

PM2
`sudo npm install pm2 -g`
`pm2 start "npm run start:prod" --name a4w-api`
`pm2 start "http-server ./dist/apps4web --port 4300" --name a4w`
(`pm2 start "npm run serve:build" --name a4w`) lite server
`pm2 startup` ???
`systemctl status`
Samples
`pm2 stop app_name_or_id`
`pm2 restart app_name_or_id` oder `pm2 restart app1 app2 app3` oder `pm2 restart all`
`pm2 list`
`pm2 info app_name`
`pm2 monit`

Setting Up Nginx as a Reverse Proxy Server
`sudo nano /etc/nginx/sites-available/your_domain`
`server {
...
location / {
proxy_pass http://127.0.0.1:3000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}
...
}`

PostGres

`apt install postgresql postgresql-client`
change password:
`sudo -u postgres psql`
`\password postgres`

MongoDB
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
`wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -`
`echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list`
`sudo apt-get update`
`sudo apt-get install -y mongodb-org`

`sudo systemctl start mongod`
`sudo systemctl enable mongod`
`sudo systemctl status mongod`
`sudo service mongod start`

Git
`sudo apt install git`
`git config --global user.name "debian"`
`git config --global user.email "name@domain.com"`

**Node Project**
`sudo mkdir -p /var/www/your_domain/html`

**SSL**
https://letsencrypt.org/de/ (not needed)
https://certbot.eff.org/instructions

----------------
Requesting a certificate for apps4web.de

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/apps4web.de/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/apps4web.de/privkey.pem
This certificate expires on 2023-10-05.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for apps4web.de to /etc/nginx/sites-enabled/a4w
Congratulations! You have successfully enabled HTTPS on https://apps4web.de
------------------

Log bei Installation von certbot
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/apps4web

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://apps4web.de

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=apps4web.de
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:

- Congratulations! Your certificate and chain have been saved at:
  /etc/letsencrypt/live/apps4web.de/fullchain.pem
  Your key file has been saved at:
  /etc/letsencrypt/live/apps4web.de/privkey.pem
  Your cert will expire on 2020-06-19. To obtain a new or tweaked
  version of this certificate in the future, simply run certbot again
  with the "certonly" option. To non-interactively renew *all* of
  your certificates, run "certbot renew"
- Your account credentials have been saved in your Certbot
  configuration directory at /etc/letsencrypt. You should make a
  secure backup of this folder now. This configuration directory will
  also contain certificates and private keys obtained by Certbot so
  making regular backups of this folder is ideal.
- If you like Certbot, please consider supporting our work by:

  Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
  Donating to EFF:                    https://eff.org/donate-le
