import Jabatan from '#models/jabatan'
import Penugasan from '#models/penugasan'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    console.log("Mulai Membuat Data User")

    //User 
    const user = await User.createMany([
      { username: 'admin', nama: 'Admin', email: 'admin@admin.com' },
      { username: 'user1', nama: 'User 1', email: 'user1@user.com' },
      { username: 'user2', nama: 'User 2', email: 'user2@user.com' },
      { username: 'user3', nama: 'User 3', email: 'user3@user.com' },
      { username: 'user4', nama: 'User 4', email: 'user4@user.com' },
      { username: 'user5', nama: 'User 5', email: 'user5@user.com' },
      { username: 'user6', nama: 'User 6', email: 'user6@user.com' },
      { username: 'user7', nama: 'User 7', email: 'user7@user.com' },
      { username: 'user8', nama: 'User 8', email: 'user8@user.com' },
      { username: 'user9', nama: 'User 9', email: 'user9@user.com' },
      { username: 'user10', nama: 'User 10', email: 'user10@user.com' },
      { username: 'user11', nama: 'User 11', email: 'user11@user.com' },
      { username: 'user12', nama: 'User 12', email: 'user12@user.com' },
      { username: 'user13', nama: 'User 13', email: 'user13@user.com' },
      { username: 'user14', nama: 'User 14', email: 'user14@user.com' },
      { username: 'user15', nama: 'User 15', email: 'user15@user.com' },
      { username: 'user16', nama: 'User 16', email: 'user16@user.com' },
      { username: 'user17', nama: 'User 17', email: 'user17@user.com' },
      { username: 'user18', nama: 'User 18', email: 'user18@user.com' },
      { username: 'user19', nama: 'User 19', email: 'user19@user.com' },
      { username: 'user20', nama: 'User 20', email: 'user20@user.com' },
      { username: 'user21', nama: 'User 21', email: 'user21@user.com' },
      { username: 'user22', nama: 'User 22', email: 'user22@user.com' },
      { username: 'user23', nama: 'User 23', email: 'user23@user.com' },
      { username: 'user24', nama: 'User 24', email: 'user24@user.com' },
      { username: 'user25', nama: 'User 25', email: 'user25@user.com' },
      { username: 'user26', nama: 'User 26', email: 'user26@user.com' },
      { username: 'user27', nama: 'User 27', email: 'user27@user.com' },
      { username: 'user28', nama: 'User 28', email: 'user28@user.com' },
      { username: 'user29', nama: 'User 29', email: 'user29@user.com' },
      { username: 'user30', nama: 'User 30', email: 'user30@user.com' },
    ])

    console.log("Selesai Membuat Data User")

    //Penugasan
    console.log("Mulai Membuat Data Penugasan")
    const jabatan = await Jabatan.all()
    const penugasan = jabatan.map((item, index) => {
      return {
        jabatan: item.id,
        pejabat: user[index].username
      }
    })
    await Penugasan.createMany(penugasan)

    console.log("Selesai Membuat Data")
  }
}