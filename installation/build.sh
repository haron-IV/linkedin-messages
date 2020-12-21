#clear old files
cd ..
rm -rf ./linkedin-bot/*
rm ./linkedin-bot/.env

#copy api, bot and interface
cp -r ./api ./linkedin-bot/api
cd ./gui
npm run build
cd ..
cp -r ./gui/dist ./linkedin-bot/gui
cp -r ./bot ./linkedin-bot/bot
mkdir ./linkedin-bot/logs
touch ./linkedin-bot/logs/logs.log

# vopy window installation files
cp ./installation/bot.bat ./linkedin-bot
cp ./installation/install.bat ./linkedin-bot
cp ./installation/interface.bat ./linkedin-bot
cp ./index.js ./linkedin-bot
cp ./package.json ./linkedin-bot
cp ./package-lock.json ./linkedin-bot
cp ./.env ./linkedin-bot


# create auth-key.txt file
API_AUTH_KEY=$(grep API_AUTH_KEY= .env | xargs)
KEY="${API_AUTH_KEY#*=}"
echo $KEY >> ./linkedin-bot/auth-key.txt

# create zip and clear project
zip -vr bot.zip ./linkedin-bot
rm /Users/$USER/Desktop/bot.zip
mv bot.zip /Users/$USER/Desktop
rm -rf ./linkedin-bot/*