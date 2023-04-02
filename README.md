# web.sh
Access Your Terminal From Anywhere
```
sudo npm i -g @sx9dev/web.sh@latest && web-sh
```

# Example Use: Remotly Shutdown Linux

Heres How You Can Do This On Your Linux Machine:

![](https://media.discordapp.net/attachments/888341509076824067/1092058402596868267/Videoleap_2023_04_02_19_05_04_429.mp4)

1. Install Web.Sh (On Host)

Ill Assume You Already Have It Instaled.<br>
**Note**: Use Systemd (Or Any Init System) To Launch Web.sh On Startup.

---

2. Install Tailscale (On Both)

To Make Sure You Can Do This From Anywhere Install Tailscale On Both Your Phone (Client) And Your Linux Machine (Host)

---

3. Install An HTTP Client (On Client)

Configure Your HTTP Client To Send A Request To Our Host IP And Run The Shutdown Command

---

Now Try And Test It
