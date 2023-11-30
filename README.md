# Octactl

OctaSpace command line tool

## Installation

Manually install `sudo` (Optional), `wireguard-tools` and `net-tools`
\
`sudo` is only required if you are not root!\
Root permission is essential for Connecting/Disonnecting VPN.\
So it will ask for sudo password if you are not root while performing those operations.
\
Debian Based (Ubuntu, Kali, etc):

```
apt install sudo wireguard-tools net-tools
```

RPM based:\
(CentOS)

```
yum install sudo wireguard-tools net-tools
```

(Fedora)

```
dnf install sudo wireguard-tools net-tools
```

Alphine

```
apk add sudo wireguard-tools net-tools
```

## Build

```
npm install
npm run build
```

\
By default it will build for linux x64, you can modify package.json to build for arm64.
\
Note: **Only** Linux is supported
