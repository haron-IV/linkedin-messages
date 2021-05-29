const logger = require("../api/logger");
const selectUserToSendMsg = require("./userTargetSelector");
const { messageWindow, openMessageBtn, sendMessageBtn, messageCloseBtn, messageListInChat } = require("./elements");
const { saveUserInfo, getUserByProfileLink, getUsersByProfileLinks } = require("../api/service/userService");
const { addLog } = require("../api/service/logService");
const {
  cfg: {
    url: { base, contacts },
    waitTImeAfterMessage,
  },
} = require("./utils");
const { increaseCounter, getCounter } = require("../api/service/counterService");

const checkWhetherProfileExist = async (page) => {
  const profileURL = await page.url();
  if (profileURL.includes("unavailable")) return false;
  return true;
};

const openProfile = async (page, profileLink) => {
  // ${base} sometimes links can be without orign
  await page.goto(`${profileLink}`, { waitUntil: "domcontentloaded" });
  logger.info(`Profile openend -> ${profileLink}`);
};

const checkIfUserAnswered = async (page, profileName) => {
  await page.waitFor(5000);
  await page.waitForSelector(messageListInChat);
  const messageOwners = await page.evaluate(
    (messageListInChat) =>
      [...document.querySelectorAll(`${messageListInChat} > li > div > div > a`)].map((el) => el.querySelector("span").innerText.trim()),
    messageListInChat
  );

  if (messageOwners.length < 1) return false;

  for (const [i, messageOwner] of messageOwners.entries()) {
    if (i !== 0 && messageOwner !== profileName) {
      logger.info(`${messageOwner} already sent you a message.`);
      return true;
    }
  }
  return false;
};

const openMessageWindow = async (page) => {
  await page.waitFor(5000);
  await page.waitForSelector(openMessageBtn);
  await page.click(openMessageBtn);
  await page.waitForSelector(messageWindow);
  logger.info("Message window opened");
};

const sendMessage = async (page, runConfig, user) => {
  await page.waitFor(2000);
  await page.keyboard.type(runConfig.message);
  if (runConfig.message.length > 3) {
    await page.waitFor(2000);
    await page.click(sendMessageBtn);
    await page.waitFor(3000);
    logger.info(`Message send to: ${user.fullName}`);
    addLog({ type: "info", message: `Message send to: ${user.fullName}` });
    saveUserInfo({
      ...user,
      followUpMessage: runConfig.followupMessage,
      followupMessageSendTime: new Date(runConfig.followupMessageSendTime),
      followupWasSend: false,
    });
  } else {
    logger.info(`Message to short to send.`);
  }
  await page.click(messageCloseBtn);
};

const filterUsedUsers = async (page, runConfig) => {
  let selectedUsers = await selectUserToSendMsg(page, runConfig); // select users from actual page
  const userProfileLinks = selectedUsers.map((user) => user.profileHref);

  let usedUsers = await getUsersByProfileLinks(userProfileLinks); // all used already users

  if (usedUsers && !Array.isArray(usedUsers)) {
    usedUsers = [usedUsers];
  }
  const usedUsersLinks = [...new Set(usedUsers.map((user) => user.profileLink))];

  userProfileLinks.filter((userLink) => {
    let duplicate = usedUsersLinks.filter((link) => link === userLink);
    if (Array.isArray(duplicate)) duplicate = duplicate[0];
    selectedUsers = selectedUsers.filter((selectedUser) => selectedUser.profileHref != duplicate);
  });
  logger.info(`Selected user to send message: ${selectedUsers.length}`);

  return selectedUsers;
};

const messageLoop = async (page, runConfig, limit = 999, profileName) => {
  const users = await filterUsedUsers(page, runConfig);
  for (const user of users) {
    const counter = await getCounter();
    if (counter <= limit) {
      await openProfile(page, user.profileHref);
      const profileExist = await checkWhetherProfileExist();
      if (profileExist) {
        await openMessageWindow(page);
        const shouldSendMsg = !(await checkIfUserAnswered(page, profileName));
        if (shouldSendMsg) {
          await sendMessage(page, runConfig.runConfig, user);
          await page.waitFor(waitTImeAfterMessage);
        } else {
          await page.click(messageCloseBtn);
        }
      }
      await increaseCounter();
    } else {
      logger.info("Message limit reached.");
      return;
    }
  }
};

module.exports = { messageLoop, openProfile, openMessageWindow, checkIfUserAnswered };
