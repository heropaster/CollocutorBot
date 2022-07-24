const tgApi = require('node-telegram-bot-api')
const {gameAgain, gameOptions, gameAnswers} = require('./options')

const token = '5508380693:AAESznaDMIbGuH7DpMcc-uN7EDEB1hi3Dfc'

const bot = new tgApi(token, {polling:true} )

let game = {}


const startGame = async (chatId) => {
            bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9 и тебе нужно будет его отгадать')
            const randomNumber = Math.floor(Math.random()*10);
            game[chatId] = randomNumber;
            await bot.sendMessage(chatId, 'Я загадал, отгадывай', gameAnswers)
}



const start = () => {
    //Команды
    bot.setMyCommands([
        {command:'/start', description:'Начало работы, приветствие'},
        {command:'/game', description:'Сыграть в игру'}
    ])
    //Ответ на сообщения
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/2.webp ')
            return bot.sendMessage(chatId, 'Ты начал(а) переписку со мной, привет!')
        }else

        if (text === '/game') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/a67/687/a67687d7-a192-4eec-a91c-96b36966ba89/192/4.webp')
            bot.sendMessage(chatId, 'Хочешь сыграть в игру?', gameOptions)

        }else
        
        if (text.toLowerCase() === 'привет'||text.toLowerCase() ===  'здравствуй'||text.toLowerCase() === 'здравствйте'||text.toLowerCase() === 'здарова'||
        text.toLowerCase() === 'ку'||text.toLowerCase === 'hello'||text.toLowerCase() === 'qq'||text.toLowerCase() === 'hi') {
            return bot.sendMessage(chatId, `И тебе ${text}, ${msg.from.first_name}!`)
        }else
            return bot.sendMessage(chatId, `Я не понимаю тебя..Чего ты хочешь?`)

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg);

        

        if (data === 'Yes')  {
            await startGame(chatId)
            
            bot.on('callback_query',async msg => {
                if (msg.data === '/again') {
                    return await startGame(chatId); 
                } else
                if (+msg.data === game[chatId]) {
                    return await bot.sendMessage(chatId, 'Молодец, ты отгадал(а)!', gameAgain)
                }else {
                    return await bot.sendMessage(chatId, `Ты не угадал, я загадал ${game[chatId]}`, gameAgain)
                }
            })
        
        }else if (data === 'No') {
            return  bot.sendMessage(chatId, 'Очень жаль...')
        }
    }) 
}
start()