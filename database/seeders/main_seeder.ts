import { BaseSeeder } from '@adonisjs/lucid/seeders'
import integrasi_seeder from './list/integrasi_seeder.js'
import input_datum_seeder from './list/input_datum_seeder.js'

export default class extends BaseSeeder {
  public static environment = ['development', 'production']

  public async run() {
    console.log('▶ Running main seeder...')
    // Seeder yg kamu ingin jalankan
    const selected = [
      'input_datum',
      'integrasi',
    ]

    const map: Record<string, any> = {
      input_datum: input_datum_seeder,
      integrasi: integrasi_seeder,
    }

    for (const key of selected) {
      const Seeder = map[key]
      if (Seeder) {
        console.log(`▶ Running ${key} seeder...`)
        await new Seeder(this.client).run()
      }
    }
  }
}