"use strict"

// const {Shop} = require("../models")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "syifa",
        age: 20,
        address: "semarang",
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    const idSyifa = await queryInterface.rawSelect(
      "Users",
      {
        where: { name: "syifa" }
      },
      ["id"]
    )

    await queryInterface.bulkInsert("Auths", [
      {
        email: "syifa@gmail.com",
        password: "$2a$12$lPYe8hgBzhfTc7Us5v2bR.7CMo4.lmZoN1Jpd6xTG8a/298QEjzjS",
        confirmPassword: "$2a$12$lPYe8hgBzhfTc7Us5v2bR.7CMo4.lmZoN1Jpd6xTG8a/298QEjzjS",
        userId: idSyifa,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
    await queryInterface.bulkDelete("Auths", null, {})
  }
}
