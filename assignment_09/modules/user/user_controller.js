const userModel = require('../../DB/model/user_model.js');
const postModel = require('../../DB/model/post_model.js');
const fs = require('fs');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const internalServerError = require('../../utils/internal_server_error.js');
const { sendConfirmationEmail } = require('../../utils/send_emails.js');

const displayProfile = async (req, res) => {
  try {
    const user = req.user;
    const posts = await postModel.find({ createdBy: req.user._id, isDeleted: false }).populate({
      path: 'comments',
      match: { isDeleted: false },
      select: 'commentContent',
      populate: {
        path: 'replies',
        match: { isDeleted: false },
        select: 'commentContent',
        populate: {
          path: 'replies',
          match: { isDeleted: false },
          select: 'commentContent',
        },
      },
    });
    const qrCode = await QRCode.toDataURL(user.email, { errorCorrectionLevel: 'H' });
    res.status(200).json({ user, posts, qrCode });
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, ...rest } = req.body;

    let passedData;

    if (!email) {
      passedData = rest;
    } else {
      passedData = { email, ...rest };
    }

    const user = await userModel
      .findByIdAndUpdate(req.user._id, passedData, { new: true })
      .select('-password -createdAt -updatedAt');

    if (email && user.email == email) {
      user.emailConfirmed = false;
      await user.save();

      sendConfirmationEmail(req, user, 5 * 60);
      res.status(200).json({ message: 'User updated check your email to confirm your account', user }); // 200 OK
    } else {
      res.status(200).json({ message: 'Done', user });
    }
  } catch (error) {
    if (error?.keyValue?.email) {
      res.status(409).json({ message: 'Email already exists' }); // 409: Conflict
    } else if (error?.keyValue?.userName) {
      res.status(409).json({ message: 'User name already exists' }); // 409: Conflict
    } else {
      internalServerError(res, error);
    }
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    if (oldPassword == newPassword) {
      res.status(400).json({ message: 'new password cannot equal old password' }); // 400 Bad Request
    } else {
      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        res.status(400).json({ message: 'in-valid old password' }); // 400 Bad Request
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(200).json({ message: 'Done' }); // 200 OK
      }
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfilePic = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    const user = await userModel.findById(req.user.id);

    if (user.profilePic) {
      fs.unlinkSync(user.profilePic); // Relative path
    }

    const newImageURL = `${req.filePath}/${req.file.filename}`;
    const updatedUserImage = await userModel.findByIdAndUpdate(req.user.id, { profilePic: newImageURL }, { new: true });

    res.status(200).json({ message: 'Done', updatedUserImage }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfileCoverPic = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    const imageUrls = [];

    req.files.forEach(file => {
      imageUrls.push(`${req.filePath}/${file.filename}`);
    });

    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { coverPic: imageUrls }, { new: true });

    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const qr = async (req, res) => {
  const user = await userModel.findOne({ _id: req.user._id }).select('userName email phone');

  QRCode.toDataURL(`${req.protocol}://${req.headers.host}/user/profile${user._id}`, function (err, url) {
    if (err) {
      res.json({ message: 'Qr code error' });
    } else {
      res.json({ message: 'Done', url });
    }
  });
};

const deActive = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user._id, { isDeactivated: true }, { new: true });
    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  displayProfile,
  updateProfile,
  updatePassword,
  updateProfilePic,
  updateProfileCoverPic,
  qr,
  deActive,
};
