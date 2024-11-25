FROM fedora:37

RUN sudo dnf -y update &&\
    sudo dnf install -y https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm &&\
    sudo dnf install -y git ffmpeg ImageMagick nodejs yarnpkg libwebp &&\
    sudo dnf clean all -y

RUN git clone https://github.com/The-DiosBot-MD/The-MikuBot-MDV4

WORKDIR /root/The-MikuBot-MDV4

COPY ./root/The-MikuBot-MDV4

RUN yarn install

CMD ["node", "index.js"]
