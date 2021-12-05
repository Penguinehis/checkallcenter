
How to install?

First Install NVM: 

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

Second close and reopen your terminal

Third install the node v16

nvm install 16

Four clone the repository

git clone https://github.com/Penguinehis/checkallcenter.git

Five go to the folder 

cd checkallcenter

Six install the dependencies

npm i && apt install screen -y

Seven start a screen 

screen -S api

Eight start the program using the command node index.js, and insert your TOKEN , if the token is OK you gonna view your console simple go black and the api is ONLINE

After that, press ctrl + a + d

For check if is online use the command lsof -i :6888

If shows Exemple "node    31869 root   22u  IPv6 2272619      0t0  TCP *:6888 (LISTEN)"

Its Online and Running!

After that just implement your API

The follwing methods is allowed

Exemple in Linux command

/checkUser:

curl --request POST \
  --url http://IPVPS:6888/checkUser \
  --header 'Content-Type: application/json' \
  --data '{
    "user": "USERFORCHECK",
}'

This gonna return you the follwing menssages 

If the user exist and have date its gonna show the expiration date in this format: exemple 20220102, YEAR , MONTH, DAY

If the user not exist : not exist

If the user not have expiration date: never

/checkOnline:

curl --request GET \
  --url http://IPVPS:6888/checkOnline

This gonna return the number of users online: Exemple: 88

/OnlineFULL:

curl --request GET \
  --url http://IPVPS:6888/OnlineFULL

Only work with SSHPLUS Variants exemple the CrashVPN script with is free in the site https://worldofdragon.net

And is gonna return this exemple: 

👤user 1/2 ⏳01:41:45

/checkUser2/

http://ipvps:6888/checkUser2/USERYOUWANT

This gonna return in the browser this: Exemple 

👤User: sisudatu<br>
⏳Validity: 01/02/2022<br>
⏳Time Left: 27<br>

And its it very simple
