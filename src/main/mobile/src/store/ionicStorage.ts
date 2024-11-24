import { Storage } from '@ionic/storage'

const ionicStorage = new Storage()
await ionicStorage.create()

export default ionicStorage
