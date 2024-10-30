#!/bin/bash
wget https://github.com/protocolbuffers/protobuf/releases/download/v28.3/protoc-28.3-linux-x86_64.zip
mkdir -p $HOME/protoc
unzip protoc-28.3-linux-x86_64.zip -d $HOME/protoc
export PATH=$PATH:$HOME/protoc/bin
