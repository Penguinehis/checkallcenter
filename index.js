const nodeList = require("util");
const childProcessA = require("child_process");
const fsOps = require("fs");
const createSecureH = require("https");
const formattedTime = require("express");
const calculateMinS = require("cors");
const {
  curl: sendAuthToken,
  sleep: delayFunction,
} = require("johngrimm-utils");
const createAuthUI = require("terminal-kit").terminal;
require("dotenv").config();
var myAppInstance = formattedTime();
myAppInstance.use(calculateMinS());
myAppInstance.use(
  formattedTime.json({
    limit: "20mb",
    extended: true,
  }),
);
var portSetting = 6888;
(async () => {
  createAuthUI.green("\nDIGITE O SEU TOKEN DE ACESSO: ");
  let authorization = await createAuthUI.inputField().promise;
  if (!authorization || authorization == undefined || authorization == "") {
    createAuthUI.red("\nVOCÊ NÃO ESTÁ AUTORIZADO");
    await delayFunction(2000);
    process.exit(0);
  }
  let authResponse = await sendAuthToken({
    url: "http://api.worldofdragon.net:6888/auth",
    method: "POST",
    body: '{"token": "' + authorization + '"}',
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (authResponse != "authenticate") {
    console.clear();
    createAuthUI.red("\nVOCÊ NÃO ESTÁ AUTORIZADO");
    await delayFunction(2000);
    process.exit(0);
  }
  let secureServer = 0;
  if (secureServer == 1) {
    createSecureH
      .createServer(
        {
          key: fsOps.readFileSync(process.env.SSL_KEY_PATH),
          cert: fsOps.readFileSync(process.env.SSL_CERT_PATH),
        },
        myAppInstance,
      )
      .listen(portSetting);
    console.clear();
    console.log("\nHttps server running on port " + portSetting);
  } else {
    myAppInstance.listen(portSetting, () => {
      console.clear();
      console.log("\nHttp server running on port " + portSetting);
    });
  }
})();
myAppInstance.post(
  "/checkUser",
  async function validateUser(jwtUserToken, sendError) {
    if (!jwtUserToken.body.user) {
      return sendError.status(401).send("MISSING PARAMS!");
    }
    var jwtUsername = jwtUserToken.body.user;
    childProcessA.exec(
      "expire2=" +
        jwtUsername +
        '\nexpire="$(chage -l $expire2| grep -E "Account expires" | cut -d \' \' -f3-)"\n\nif [ -z "$expire" ]; then\necho "not exist"\nelif [ "$expire" = "never" ]; then\necho "never"\nelse\ndate -d "$expire" +"%Y%m%d"\nfi',
      {
        shell: "/bin/bash",
      },
      (uniqueError, errorMessage, errorHandler) => {
        return sendError.send(errorMessage);
      },
    );
  },
);
myAppInstance.get(
  "/checkOnline",
  async function checkSSHandVN(ovpnStatusLog, getSessionOrB) {
    childProcessA.exec(
      '\n_ons=$(ps -x | grep sshd | grep -v root | grep priv | wc -l)\n[[ -e /etc/openvpn/openvpn-status.log ]] && _onop=$(grep -c "10.8.0" /etc/openvpn/openvpn-status.log) || _onop="0"\n[[ -e /etc/default/dropbear ]] && _drp=$(ps aux | grep dropbear | grep -v grep | wc -l) _ondrp=$(($_drp - 1)) || _ondrp="0"\n_onli=$(($_ons + $_onop + $_ondrp))\necho "$_onli"',
      {
        shell: "/bin/bash",
      },
      (sessionId, _sessionId, executeWithSd) => {
        return getSessionOrB.send(_sessionId);
      },
    );
  },
);
myAppInstance.get(
  "/OnlineFULL",
  async function checkOnline(dbNameForOnlF, dbName) {
    childProcessA.exec(
      '#!/bin/bash\n            database="/root/usuarios.db"\n            for user in $(cat /etc/passwd|awk -F : \'$3 >= 1000 {print $1}\'|grep -v nobody)\n            do\n                [[ "$(grep -w $user $database)" != "0" ]] && lim="$(grep -w $user $database| cut -d\' \' -f2)" || lim=0\n                [[ $(netstat -nltp|grep \'dropbear\'| wc -l) != \'0\' ]] && drop="$(fun_drop | grep "$user" | wc -l)" || drop=0\n                [[ -e /etc/openvpn/openvpn-status.log ]] && ovp="$(cat /etc/openvpn/openvpn-status.log | grep -E ,"$user", | wc -l)" || ovp=0\n                sqd="$(ps -u $user | grep sshd | wc -l)"\n                _cont=$(($drop + $ovp))\n                conex=$(($_cont + $sqd))\n                if [[ $conex -gt \'0\' ]]; then\n                    timerr="$(ps -o etime $(ps -u $user |grep sshd |awk \'NR==1 {print $1}\')|awk \'NR==2 {print $1}\')"\n                    info2+="------------------------------<br>"\n                    info2+="👤$user       $conex/$lim       ⏳$timerr<br>"\n                fi\n            done\n            echo -e "$info2"',
      {
        shell: "/bin/bash",
      },
      (dbData, taskName, operation) => {
        return dbName.send(taskName);
      },
    );
  },
);
myAppInstance.get(
  "/checkUser2/:user",
  async function checkUserSSHV(asyncFunction, dbResult) {
    if (!asyncFunction.params.user) {
      return dbResult.status(401).send("MISSING PARAMS!");
    }
    var userParam = asyncFunction.params.user;
    childProcessA.exec(
      "expire2=" +
        userParam +
        '\nexpire="$(chage -l $expire2| grep -E "Account expires" | cut -d \' \' -f3-)"\n\nif [ -z "$expire" ]; then\necho "not exist"\nelif [ "$expire" = "never" ]; then\necho "never"\nelse\ndate -d "$expire" +"%m/%d/%Y" \nfi',
      {
        shell: "/bin/bash",
      },
      (userInput, validityDays, formatValidUt) => {
        return dbResult.send(
          "👤User: " +
            userParam +
            "<br>⏳Validity: " +
            validityDays +
            "<br>⏳Time Left: " +
            calculateDays(validityDays).days,
        );
      },
    );
  },
);
setInterval(function () {
  _0x3a904d();
}, 4000);
async function execCheckExp(checkExpirySS) {
  let shellCommandO = await childProcessA.execSync(checkExpirySS).toString();
  return shellCommandO;
}
function calculateDays(accountExpiry) {
  const timeUntilExp = Date.parse(accountExpiry) - Date.parse(new Date());
  const daysUntilExp = Math.floor(timeUntilExp / 86400000);
  const _accountExpiry = {
    total: timeUntilExp,
    days: daysUntilExp,
  };
  return _accountExpiry;
}
createAuthUI.on("key", function (escapeKey, userId, onLogout) {
  if (escapeKey === "CTRL_C") {
    process.exit();
  }
});
