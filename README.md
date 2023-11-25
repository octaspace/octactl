# Octactl

OctaSpace command line tool

## Installation

Manually install `wireguard-tools` and `net-tools`
\
Debian Based (Ubuntu, Kali, etc):

```
sudo apt install wireguard-tools net-tools
```

RPM based:\
(CentOS)

```
yum install wireguard-tools net-tools
```

(Fedora)

```
dnf install wireguard-tools net-tools
```

Alphine

```
apk add wireguard-tools net-tools
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
