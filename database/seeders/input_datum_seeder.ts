import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const filePath = app.publicPath('input_datum.xlsx')

    // Baca file Excel
    const fileBuffer = fs.readFileSync(filePath)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })

    // Ambil sheet pertama
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Konversi ke JSON
    const data = XLSX.utils.sheet_to_json(worksheet)

  }
}
