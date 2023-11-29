const User = require('../model/userModel')
const bcrypt = require('bcrypt')

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password, phoneNumber} = req.body
    const usernameCheck = await User.findOne({ username })
    if(usernameCheck)
        return res.json({msg: 'Username already in use', status: false })
    const emailCheck = await User.findOne({ email })
    if (emailCheck)
        return res.json({msg: 'Email already in use', status: false })
    // Phone number not required right now
    // const phoneCheck = await User.findOne({ phoneNumber })
    // if (phoneCheck)
    //     return res.json({ msg: 'Phone number already in use.', status: false})
    const hashedPass = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        // phoneNumber,
        email,
        pass: hashedPass
    })
    delete user.pass
    return res.json({ status: true, user })
    } catch(ex) {
        next(ex)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
    const user = await User.findOne({ username })
    if(!user)
        return res.json({ msg: 'Incorrect username', status: false })
    const isPassValid = await bcrypt.compare(password, user.pass)
    if (!isPassValid)
        return res.json({ msg: 'Incorrect password', status: false })
    delete user.pass
    return res.json({ status: true, user })
    } catch(ex) {
        next(ex)
    }
}

module.exports.setAvatar = async ( req, res, next ) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        })
        if (userData)
        return res.json({isSet:userData.isAvatarImageSet, image:userData.avatarImage})
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllUsers = async ( req, res, next ) => {
    try {
        const users = await User.find({_id:{ $ne: req.params.id }}).select([
            'email',
            'username',
            'avatarImage',
            '_id'
        ])
        return res.json(users)
    } catch( ex ) {
        next(ex)
    }
}