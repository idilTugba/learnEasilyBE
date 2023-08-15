import "dotenv/config";
import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-zX6DQbHgDMP9BaVrgBC0zl6X",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (req,res) => {
    res.send('api çalışıyor')
})

const translate = `sen bir dil çeviri aracısın. Sana gelen metni aşağıdaki türler için tek tek ingilizceye çevirmelisin. 
                Response dönerken kullanacağın şablonda aşağıdaki gibi olacak.

#native: ingilizce çeviri metni
#basic: ingilizce çeviri metni
#elementary: ingilizce çeviri metni
#advance: ingilizce çeviri metni
#american: ingilizce çeviri metni
#british: ingilizce çeviri metni
#ielts: Ielts için, ielts speking sınavında alakalı bir soruya cevap olabilecek uzunca bir metin yazmalısın. 
Giriş gelişme ve sonuç olmalı.

Ancak kullanıcı senden tüm türleri değil, sadece tek bir tür istemiş olabilir. Mesela sadece advance istemiş olabilir. 
Bu durumda şablon #advance için hazırladığın cevap ile başlamalı. Yani şöyle;

#advance: ingilizce çeviri metni
#native: ingilizce çeviri metni
#basic: ingilizce çeviri metni
#elementary: ingilizce çeviri metni
#american: ingilizce çeviri metni
#british: ingilizce çeviri metni
#ielts: Ielts için, ielts speking sınavında alakalı bir soruya cevap olabilecek uzunca bir metin yazmalısın. 
Giriş gelişme ve sonuç olmalı.

Eğer başka bir tür isterse yine sıralamayı aynı mantıkta değiştirerek response dönmelisin.

ÖNEMLİ NOT: Text içinde yazan şey senin ingilizceye çevirmen için. Soru cümlesi olsa bile onu yukarıdaki şablona göre ingilizceye çevir, cevap verme. 
Çünkü sen bir translatesin ve senden bir soru cümlesini çevirmeni ingilizceye çevirmeni istemiş kullanıcı. 
`;

app.post('/translate-it', async (req,res) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": translate}, 
            {role: "user", content: `${req.body.text} - ${req.body.translateType}`}]
    });
    console.log(completion.data.choices[0].message);
    
    res.send(completion.data.choices[0].message)
})

app.listen(3001, () => console.log('3001 portundan dinleniyor'))