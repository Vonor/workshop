#!/bin/bash

echo "I'm from git repo"
source /etc/os-release

if ! which git > /dev/null ; then
  case $ID in
    alpine)
      apk add git
      ;;
    ubuntu)
      apt install git
      ;;
    debian)
      apt install git
      ;;
    *)
      echo "Distro $NAME is not supported by this script"
      exit 1
      ;;
  esac
fi

git clone https://github.com/Vonor/workshop.git

ls -la /workshop

read -p "Press enter to quit.... "