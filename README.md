# web.sh
Access Your Terminal From Anywhere
```bash
# Install:
sudo npm i -g @sx9dev/web.sh@latest 
# Runing:
PASSWORD="password_here" web-sh
```
# Docs

## Setup Autostart
To Run Web.Sh On Startup Do This (**Linux Only**):
```bash
PASSWORD="default_password_here" web-sh setup
systemctl enable websh --user --now
```
---
## Running A Command

To Run A Command Send The Following Request:

**POST** /run?pass=_PASSWORD_
```json
["COMMAND_OR_EXECUTABLE", "ARG1", "ARG2", "ARGS"]
```
