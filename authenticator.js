const User = require('../models/User');
const crypto = require('crypto');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { createAccessToken } = require('../auth');

// POST /2fa/init
module.exports.init = async (req, res) => {
  try {
    const secret = authenticator.generateSecret();
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const otpauthUrl = authenticator.keyuri(user.email, 'YourApp', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    user.twoFactorSecretPending = secret;
    await user.save();

    return res.status(200).send({ qrCodeUrl, manualSecret: secret });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// POST /2fa/confirm
module.exports.confirm = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.twoFactorSecretPending) {
      return res.status(400).send({ message: "No pending 2FA setup found" });
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecretPending });

    if (!isValid) {
      return res.status(400).send({ message: "Invalid code" });
    }

    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex')
    );
    const hashedBackupCodes = backupCodes.map(c =>
      crypto.createHash('sha256').update(c).digest('hex')
    );

    user.twoFactorSecret = user.twoFactorSecretPending;
    user.twoFactorSecretPending = null;
    user.twoFactorEnabled = true;
    user.backupCodes = hashedBackupCodes;
    await user.save();

    return res.status(200).send({ message: "2FA enabled successfully", backupCodes });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// POST /2fa/verify
module.exports.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.tempAuth.id;

    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).send({ message: "2FA is not set up for this account" });
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });

    if (!isValid) {
      return res.status(401).send({ message: "Invalid code" });
    }

    return res.status(200).send({
      success: true,
      message: "User logged in successfully",
      access: createAccessToken(user)
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};