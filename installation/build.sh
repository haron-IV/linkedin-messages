#clear old files
cd ..
rm -rf ./linkedin-bot/*

#copy api, bot and interface
cp -r ./api ./linkedin-bot/api
cd ./gui
npm run build
cd ..
cp -r ./gui/dist ./linkedin-bot/gui
cp -r ./bot ./linkedin-bot/bot

# vopy window installation files
cp ./installation/bot.bat ./linkedin-bot
cp ./installation/install.bat ./linkedin-bot
cp ./index.js ./linkedin-bot
cp ./package.json ./linkedin-bot
cp ./package-lock.json ./linkedin-bot
cp ./.env ./linkedin-bot

# create zip
zip -vr bot.zip ./linkedin-bot
rm /Users/$USER/Desktop/bot.zip
mv bot.zip /Users/$USER/Desktop