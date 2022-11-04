import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { Types } from 'mongoose';

const secret_key = '*@#$%^&*()-_=+'

export const readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
            throw err;

        }
        else {
            callback(null, html);
        }
    });
};

export const allFieldsRequired = (data) => {
    const cloneData = [...data]
    let validatorArray = []
    cloneData?.forEach(value => {
        validatorArray?.push(!value)
    });
    return validatorArray?.some(data => !!data)
}


export const hashPassword = async (value) => {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(value, saltRounds, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        })
    })
    return hashedPassword
}

export const comparePassword = async (password, hashPassword) => {
    const compared = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, (err, response) => {
            if (err) reject(err)
            resolve(response)
        })
    })
    return compared
}

export const generateNewToken = async (payload, schedule = 60) => {
    const token = await new Promise((resolve, reject) => {
        jwt.sign({...payload, exp: Math.floor(Date.now() / 1000) + (schedule * 60)}, secret_key, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
    return token
}

export const verifyUserToken = async (token) => {
    const isVerified = jwt.verify(token, secret_key)
    return isVerified
}

export const handleAdminAccess = async(token) => {
    const isAdminAuthorized = await verifyUserToken(token)
    return isAdminAuthorized?.role === "admin"
}

export const isValidObjectId = id => Types.ObjectId.isValid(id)

export const isTokenExpired = async(res, token) => {
    try {
        const isExpired = jwt.verify(token, secret_key)
        if(!isExpired) return true
        return isExpired?.exp <= Math.floor(Date.now() / 1000)
    } catch (error) {return true}
}
