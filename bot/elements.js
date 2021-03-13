const el = {
  loginInp: '.sign-in-form-container form div .input input[type=text]',
  passwdInp: '.sign-in-form-container form div .input input[type=password]',
  loginBtn: '.sign-in-form-container form button[type=submit]',
  users: 'div[role=main] ul li',
  openMessageBtn: '.body main div section div a',
  messageWindow: 'aside div + div[tabindex="-1"]',
  messageTextInput: 'div form div div div p',
  messageCloseBtn: 'aside div ~ div header section button ~ div ~ button',
  sendMessageBtn: 'footer div div button[type=submit]',
  maxContactPages: 'div div div button + ul li:last-child button span',
  messageListInChat: 'div > header + div > div > div > ul',
}

module.exports = el
